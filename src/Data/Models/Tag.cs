namespace PlaylistManager.Data.Models;

public record Tag(long id, string title, string createdAt);

public record TagCreateRequest(string title);