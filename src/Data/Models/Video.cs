using System.Collections.Immutable;
using System.Security.Cryptography;

namespace PlaylistManager.Data.Models;

public enum Service
{
    Unknown = 0,
    YouTube = 1,
    Vimeo = 2

}

//(System.Int64 id, System.String videoId, System.String filename, System.String title, System.String createdAt, System.String artist, System.Int64 duration, System.String uploadedAt)
public record Video(long id, string videoId, string filename, string title, DateTime createdAt, string artist, long duration, DateTime? uploadedAt, Service service, ImmutableArray<Tag>? tags = null)
{
    private Video() : this(default, string.Empty, string.Empty, string.Empty, default, string.Empty, default, default, default) { }
    public string VideoUrl => service switch
    {
        Service.YouTube => $"https://youtu.be/{videoId}",
        Service.Vimeo => $"https://vimeo.com/{videoId}",
        _ => string.Empty
    };

    public string ThumbnailUrl => service switch
    {
        Service.YouTube => $"https://img.youtube.com/vi/{videoId}/default.jpg",
        // Service.Vimeo => $"https://vumbnail.com/{videoId}",
        _ => string.Empty
    };
}

public record VideoCreateRequest(string videoId, string filename, string title, string artist, float? duration, DateTime? uploadedAt, Service service, IEnumerable<Tag>? tags = null);