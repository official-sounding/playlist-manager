using Dapper;
using PlaylistManager.Data;
using PlaylistManager.Data.Models;

public interface IPlaylistRepository {
    Task<IEnumerable<Playlist>> GetAllAsync();
    Task<Playlist?> GetByIdAsync(int id);
    Task<Playlist> CreateAsync(PlaylistCreateRequest request);

}

public class PlaylistRepository(IDbContext dbContext) : IPlaylistRepository
{
    public async Task<IEnumerable<Playlist>> GetAllAsync()
    {
        using var conn = dbContext.DbConnection;
        return await conn.QueryAsync<Playlist>("select * from playlist");
    }

    public async Task<Playlist?> GetByIdAsync(int id)
    {
        using var conn = dbContext.DbConnection;
        return (await conn.QueryAsync<Playlist, PlaylistEntry, Video, Playlist>(@"
        select *
        from playlist p
        join playlist_entry pe on p.id = pe.playlist_id
        join video v on pe.video_id = v.id 
        where p.id = @id", (playlist, playlistEntry, video) => {
            playlistEntry.video = video;
            playlist.entries.Add(playlistEntry);
            return playlist;
        }, new { id }))?.FirstOrDefault();
        
    }

    public async Task<Playlist> CreateAsync(PlaylistCreateRequest request)
    {
        using var conn = dbContext.DbConnection;
        return await conn.QueryFirstAsync<Playlist>(@"
            INSERT INTO playlist (title) 
            VALUES (@title)
            RETURNING *
        ", request);
    }
}