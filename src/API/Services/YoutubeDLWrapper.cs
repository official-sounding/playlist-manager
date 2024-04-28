using Microsoft.Extensions.Options;
using YoutubeDLSharp;
using YoutubeDLSharp.Options;

public class YoutubeDLWrapper {
    private readonly YTConfig config;
    private readonly YoutubeDL ytdl;

    public YoutubeDLWrapper(IOptions<YTConfig> options) {
        config = options.Value;
        ytdl = new YoutubeDL() {
            YoutubeDLPath = config.ytdlPath,
            FFmpegPath = config.ffmpegPath,
            OutputFolder = config.outputPath,
        };
    }

    public async Task<YTDownloadResult> DownloadAsync(string url, CancellationToken ct = default) {
        var dl = await ytdl.RunVideoDownload(url, recodeFormat: VideoRecodeFormat.Mp4, ct: ct, overrideOptions: new OptionSet() { RestrictFilenames = true});
        var data = await ytdl.RunVideoDataFetch(url, ct: ct);

        dl.EnsureSuccess();
        data.EnsureSuccess();

        return new YTDownloadResult(Path.GetFileName(dl.Data), url, data.Data.Title, data.Data.UploadDate, data.Data.Artist);
    }
}

public class YTConfig {
    public required string ytdlPath { get; set; } 
    public required string ffmpegPath { get; set; } 
    public required string outputPath { get; set; }
    }

public record YTDownloadResult(string filename, string url, string title, DateTime? uploadedAt, string artist);