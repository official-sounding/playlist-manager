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

    public async Task<Playlist?> UpdateEntriesAsync(int playlistId, PlaylistEntryUpdateRequest request) {
        using var conn = dbContext.DbConnection;
        using var transaction = conn.BeginTransaction();

        try {


        var inserted = conn.ExecuteAsync(@"
            INSERT INTO playlist_entry(playlistId, videoId, order)
            VALUES (@playlistId, @videoId, @order)
        ", request.toAdd, transaction: transaction);

        var deleted = conn.ExecuteAsync(@"
            DELETE FROM playlist_entry WHERE id = @id
        ", request.toRemove.Select(id => new { id }), transaction: transaction);

        var updated = conn.ExecuteAsync(@"
            UPDATE playlist_entry SET videoId = @videoId, order = @order
            WHERE id = @id
        ", request.toUpdate, transaction: transaction);

        await Task.WhenAll(inserted, deleted, updated);
        transaction.Commit();

        return await GetByIdAsync(playlistId);

        } catch {
            transaction.Rollback();
            throw;
        }
    }
}