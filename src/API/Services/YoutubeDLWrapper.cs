using Microsoft.Extensions.Options;
using YoutubeDLSharp;
using YoutubeDLSharp.Metadata;
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

    public async Task<YTDownloadResult> DownloadWithDataAsync(string url, CancellationToken ct = default) {

        var dl = await ytdl.RunVideoDownload(url, recodeFormat: VideoRecodeFormat.Mp4, ct: ct, overrideOptions: new OptionSet() { RestrictFilenames = true});
        var data = await GetVideoDataAsync(url);

        dl.EnsureSuccess();

        return new YTDownloadResult(Path.GetFileName(dl.Data), url, data.Title, data.UploadDate, data.Artist);
    }

    public async Task<VideoData> GetVideoDataAsync(string url, CancellationToken ct = default) {
        var data = await ytdl.RunVideoDataFetch(url, ct: ct);
        data.EnsureSuccess();
        return data.Data;

    }
}

public class YTConfig {
    public required string ytdlPath { get; set; } 
    public required string ffmpegPath { get; set; } 
    public required string outputPath { get; set; }
    }

public record YTDownloadResult(string filename, string url, string title, DateTime? uploadedAt, string artist);