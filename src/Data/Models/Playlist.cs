using System.Text;

namespace PlaylistManager.Data.Models;

public class Playlist {
    public int id { get; set; }
    public required string title { get; set; }
    public List<PlaylistEntry> entries { get; set; } = new List<PlaylistEntry>();
    public DateTime createdAt { get; set; }
    public const string M3U_NEWLINE = "\r\n";

    public string ToM3U() {
        var sb = new StringBuilder();
        sb.Append("#EXTM3U");
        sb.Append(M3U_NEWLINE);

        foreach(var entry in entries) {
            sb.Append(entry.ToM3UEntry());
        }

        return sb.ToString();
    }
}

public class PlaylistEntry {
    public int id { get; set; }
    public int playlistId { get; set; }
    public required Video video { get; set; }
    public int entryorder { get; set; }
    public DateTime createdAt { get; set; }

    
    public string ToM3UEntry() {
        return $"#EXTINF:{video.duration},{video.title}{Playlist.M3U_NEWLINE}{video.filename}{Playlist.M3U_NEWLINE}";
    }
}

public record PlaylistCreateRequest(string title);
public record PlaylistEntryCreateRequest(int playlistId, int videoId, int entryorder);

public record PlaylistEntryUpdateRequest(List<PlaylistEntryCreateRequest> toAdd, List<int> toRemove, List<PlaylistEntry> toUpdate);
