using Microsoft.Extensions.Options;
using YoutubeDLSharp;
using YoutubeDLSharp.Metadata;
using YoutubeDLSharp.Options;

public class YoutubeDLWrapper
{
    private readonly YTConfig config;
    private readonly YoutubeDL ytdl;

    public YoutubeDLWrapper(IOptions<YTConfig> options)
    {
        config = options.Value;
        ytdl = new YoutubeDL()
        {
            YoutubeDLPath = config.ytdlPath,
            FFmpegPath = config.ffmpegPath,
            OutputFolder = config.outputPath,
        };
    }

    public async Task<YTDownloadResult> DownloadWithDataAsync(string url, Action<string> outputHandler, CancellationToken ct = default)
    {
        var output = new Progress<string>(outputHandler);
        var dl = await ytdl.RunVideoDownload(url, recodeFormat: VideoRecodeFormat.Mp4, output: output, ct: ct, overrideOptions: new OptionSet() { RestrictFilenames = true });
        var data = await GetVideoDataAsync(url);

        dl.EnsureSuccess();

        return new YTDownloadResult(Path.GetFileName(dl.Data), new(data.ID, data.Title, data.Artist, data.Thumbnail, data.Duration, data.UploadDate));
    }

    public async Task<VideoData> GetVideoDataAsync(string url, CancellationToken ct = default)
    {
        var data = await ytdl.RunVideoDataFetch(url, ct: ct);
        data.EnsureSuccess();
        return data.Data;

    }
}

public class YTConfig
{
    public required string ytdlPath { get; set; }
    public required string ffmpegPath { get; set; }
    public required string outputPath { get; set; }
}

public record YTDownloadResult(string filename, VideoMetadata metadata);

public record VideoMetadata(string id, string title, string artist, string thumbnail, float? duration, DateTime? uploadedAt);