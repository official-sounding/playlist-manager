using System.Collections.Immutable;

namespace PlaylistManager.Data.Models;


//(System.Int64 id, System.String videoId, System.String filename, System.String title, System.String createdAt, System.String artist, System.Int64 duration, System.String uploadedAt)
public record Video(long id, string videoId, string filename, string title, DateTime createdAt, string artist, long duration, DateTime? uploadedAt, ImmutableArray<Tag>? tags = null)
{
    private Video(): this(default, default!, default!, default!, default!, default!, default, default) {}
    public string VideoUrl => $"https://youtu.be/{videoId}";
    public string ThumbnailUrl => $"https://img.youtube.com/vi/{videoId}/default.jpg";
}

public record VideoCreateRequest(string videoId, string filename, string title, string artist, float? duration, DateTime? uploadedAt);