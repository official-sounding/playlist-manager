using System.Text;

namespace PlaylistManager.Data.Models;

public class Playlist
{
    public int id { get; set; }
    public required string title { get; set; }
    public List<Video> entries { get; set; } = new List<Video>();
    public DateTime createdAt { get; set; }
    public const string M3U_NEWLINE = "\r\n";

    public string ToM3U()
    {
        var sb = new StringBuilder();
        sb.Append("#EXTM3U");
        sb.Append(M3U_NEWLINE);

        foreach (var video in entries)
        {
            sb.Append($"#EXTINF:{video.duration},{video.title}{M3U_NEWLINE}{video.filename}{M3U_NEWLINE}");
        }

        return sb.ToString();
    }
}

public record PlaylistCreateRequest(string title);
public record PlaylistEntryChangeRequest(long videoId, int entryorder);

public record PlaylistEntriesUpdateRequest(List<PlaylistEntryChangeRequest> toAdd, List<long> toRemove, List<PlaylistEntryChangeRequest> toUpdate);
