using System.Text.RegularExpressions;
using PlaylistManager.Data.Models;

public partial class VideoService(YoutubeDLWrapper wrapper, IVideoRepository repo)
{

    // regex matches...
    //   .+         # one or more of any characters
    //   \[         # the literal character '['
    //   (          # a matching group
    //      [^\]]+  # one or more characters that are not the literal character ']'
    //   )          # end of the matching group
    //   \]\.mp4    # the literal character string '].mp4'
    //   $          # the end of the string
    // end result, extract the contents of the square brackets next to the extension of the filename
    [GeneratedRegex(@".+\[([^\]]+)\]\.mp4$")]
    private static partial Regex filenameMapper();

    [GeneratedRegex(@".*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*")]
    private static partial Regex urlMapper();

    public async Task<bool> ValidateDownload(string url, CancellationToken ct = default) 
    {
        var id = ExtractIdFromUrl(url);
        var exists = id == null ? null : await repo.GetByYTIdAsync(id);
        return exists is null;
    }

    public async Task<Video> DownloadVideoAsync(string url, Action<string> outputHandler, CancellationToken ct = default)
    {
        var dl = await wrapper.DownloadWithDataAsync(url, outputHandler, ct);
        var exists = await repo.GetByYTIdAsync(dl.metadata.id);

        if(exists is null) {
            var createRequest = new VideoCreateRequest(dl.metadata.id, dl.filename, dl.metadata.title, dl.metadata.artist, dl.metadata.duration, dl.metadata.uploadedAt);
            return await repo.AddAsync(createRequest);
        } else {
            return exists;
        }
    }

    public async Task<bool> EnrichVideoAsync(string filename, CancellationToken ct = default)
    {
        var videoId = ExtractIdFromFilename(filename);

        if (string.IsNullOrEmpty(videoId)) return false;
        if ((await repo.GetByYTIdAsync(videoId)) is not null) return false;

        var url = BuildYouTubeUrl(videoId);

        var data = await wrapper.GetVideoDataAsync(url, ct);

        var createRequest = new VideoCreateRequest(data.ID, Path.GetFileName(filename), data.Title, data.Artist, data.Duration, data.UploadDate);

        await repo.AddAsync(createRequest);

        return true;
    }

    public async Task<FileStream?> FileStreamById(long id, CancellationToken ct = default) {
        var entry = await repo.GetByIdAsync(id);

        if (entry == null) return null;

        var fullPath = Path.Combine(wrapper.OutputPath, entry.filename);


        try {
            var file = File.OpenRead(fullPath);
            return file;
        } catch {
            return null;
        }

    }
    public string? ExtractIdFromFilename(string filename)
    {
        var match = filenameMapper().Match(filename);

        if (match.Success)
        {
            return match.Groups[1].Value;
        }

        return null;
    }

    public string? ExtractIdFromUrl(string url) {
        var match = urlMapper().Match(url);

        if(match.Success) {
            return match.Groups[1].Value;
        }

        return null;
    }

    public string BuildYouTubeUrl(string videoId) => $"https://youtu.be/{videoId}";
}