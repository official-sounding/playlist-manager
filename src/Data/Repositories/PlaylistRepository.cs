using Dapper;
using PlaylistManager.Data;
using PlaylistManager.Data.Models;

public interface IPlaylistRepository
{
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
        left join playlist_entry pe on p.id = pe.playlistId
        left join video v on pe.videoId = v.id 
        where p.id = @id", (playlist, playlistEntry, video) =>
        {
            if (playlistEntry != null)
            {
                playlistEntry.video = video;
                playlist.entries.Add(playlistEntry);
            }
            return playlist;
        }, new { id }, splitOn: "id, id"))
            .GroupBy(p => p.id)
            .Select((grp) =>
            {
                var p = grp.First();
                p.entries = grp.Where(p => p.entries.Count != 0).Select(p => p.entries.Single()).ToList();
                return p;
            })
            .FirstOrDefault();
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

    public async Task<Playlist?> UpdateEntriesAsync(int playlistId, PlaylistEntryUpdateRequest request)
    {
        using var conn = dbContext.DbConnection;
        conn.Open();
        using var transaction = conn.BeginTransaction();

        try
        {

            var tasks = new List<Task>();

            if (request?.toAdd?.Count > 0)
            {
                tasks.Add(conn.ExecuteAsync(@"
            INSERT INTO playlist_entry(playlistId, videoId, entryorder)
            VALUES (@playlistId, @videoId, @entryorder)
        ", request.toAdd, transaction: transaction));
            }

            if (request?.toRemove?.Count > 0)
            {
                tasks.Add(conn.ExecuteAsync(@"
            DELETE FROM playlist_entry WHERE id = @id
        ", request.toRemove.Select(id => new { id }), transaction: transaction));
            }

            if (request?.toUpdate?.Count > 0)
            {
                tasks.Add(conn.ExecuteAsync(@"
            UPDATE playlist_entry SET videoId = @videoId, entryorder = @entryorder
            WHERE id = @id
        ", request.toUpdate, transaction: transaction));
            }

            await Task.WhenAll(tasks);
            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();
            throw;
        }

        return await GetByIdAsync(playlistId);
    }
}