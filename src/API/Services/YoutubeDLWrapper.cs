using Microsoft.Extensions.Options;
using PlaylistManager.Data.Models;
using YoutubeDLSharp;
using YoutubeDLSharp.Metadata;
using YoutubeDLSharp.Options;

public class YoutubeDLWrapper
{
    private readonly YTConfig config;
    private readonly YoutubeDL ytdl;

    public string OutputPath => config.outputPath;

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
        var data = await GetVideoDataAsync(url, ct);

        dl.EnsureSuccess();

        var service = ServiceFromMetadata(data);

        return new YTDownloadResult(Path.GetFileName(dl.Data), new(data.ID, data.Title, data.Artist, data.Thumbnail, data.Duration, data.UploadDate, service));
    }

    private Service ServiceFromMetadata(VideoData data)
    {
        if (data.WebpageUrl.Contains("vimeo.com", StringComparison.InvariantCultureIgnoreCase))
        {
            return Service.Vimeo;
        }

        if (data.WebpageUrl.Contains("youtube.com", StringComparison.InvariantCultureIgnoreCase))
        {
            return Service.YouTube;
        }

        return Service.Unknown;
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

public record VideoMetadata(string id, string title, string artist, string thumbnail, float? duration, DateTime? uploadedAt, Service service);