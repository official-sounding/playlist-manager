using System.ComponentModel.DataAnnotations.Schema;

namespace PlaylistManager.Data.Models;


public class Video
{
    public int id { get; init; }
    public required string videoId { get; init; }
    public required string filename { get; init; }
    public required string title { get; init; }
    public required string artist { get; init; }
    public required float duration { get; init; }
    public DateTime? uploadedAt { get; init; }
    public DateTime createdAt { get; init; }

    public string VideoUrl => $"https://youtu.be/{videoId}";
    public string ThumbnailUrl => $"https://img.youtube.com/vi/{videoId}/maxresdefault.jpg";
}

public record VideoCreateRequest(string videoId, string filename, string title, string artist, float? duration, DateTime? uploadedAt);