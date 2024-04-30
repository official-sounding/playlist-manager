namespace PlaylistManager.Data.Models;

public class Playlist {
    public int id { get; set; }
    public required string title { get; set; }
    public List<PlaylistEntry> entries { get; set; } = new List<PlaylistEntry>();
    public DateTime createdAt { get; set; }
}

public class PlaylistEntry {
    public int id { get; set; }
    public int playlistId { get; set; }
    public required Video video { get; set; }
    public int order { get; set; }
    public DateTime createdAt { get; set; }
}

public record PlaylistCreateRequest(string title);
public record PlaylistEntryCreateRequest(int playlistId, int videoId, int order);