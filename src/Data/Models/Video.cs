using System.ComponentModel.DataAnnotations.Schema;

namespace PlaylistManager.Data.Models;


public class Video {
    public int id { get; init; }
    public required string videoUrl { get; init; }
    public required string filename { get; init; }
    public required string title { get; init; }
    public DateTime CreatedAt { get; init; }
}

public record VideoCreateRequest(string videoUrl, string filename, string title);