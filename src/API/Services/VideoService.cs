using System.Text.RegularExpressions;
using PlaylistManager.Data.Models;

public class VideoService(YoutubeDLWrapper wrapper, IVideoRepository repo)
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
    private readonly Regex filenameMapper = new Regex(@".+\[([^\]]+)\]\.mp4$");

    public async Task<Video> DownloadVideoAsync(string url, Action<string> outputHandler, CancellationToken ct = default)
    {
        var dl = await wrapper.DownloadWithDataAsync(url, outputHandler, ct);

        var createRequest = new VideoCreateRequest(dl.url, dl.filename, dl.title);

        return await repo.AddAsync(createRequest);
    }

    public async Task<bool> EnrichVideoAsync(string filename, CancellationToken ct = default)
    {
        var videoId = ExtractIdFromFilename(filename);

        if (string.IsNullOrEmpty(videoId)) return false;

        var url = BuildYouTubeUrl(videoId);

        var data = await wrapper.GetVideoDataAsync(url, ct);

        var createRequest = new VideoCreateRequest(url, Path.GetFileName(filename), data.Title);

        await repo.AddAsync(createRequest);

        return true;
    }

    public string? ExtractIdFromFilename(string filename)
    {
        var match = filenameMapper.Match(filename);

        if (match.Success)
        {
            return match.Groups[1].Value;
        }

        return null;
    }

    public string BuildYouTubeUrl(string videoId) => $"https://youtu.be/{videoId}";
}