using PlaylistManager.Data.Models;



public class VideoService(YoutubeDLWrapper wrapper, IVideoRepository repo) {
    public async Task<Video> DownloadVideoAsync(string url, CancellationToken ct = default) {
        var dl = await wrapper.DownloadWithDataAsync(url, ct);

        var createRequest = new VideoCreateRequest(dl.url, dl.filename, dl.title);

        return await repo.AddAsync(createRequest);
    }
}