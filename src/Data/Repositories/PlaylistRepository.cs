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
        return (await conn.QueryAsync<Playlist, Video, Tag, PlaylistEntryDTO>(@"select p.*, v.*, t.*
        from playlist p
        left join playlist_entry pe on p.id = pe.playlistId
        left join video v on pe.videoId = v.id 
        left join tag_video tv on v.id = tv.videoId
        left join tag t on tv.tagId = t.id
        order by p.id, pe.entryorder", (playlist, video, tag) => new(playlist, new(video, tag))))
            .GroupBy(p => p.playlist.id)
            .Select((grp) =>
            {
                var (playlist, _) = grp.First();
                playlist.entries = VideoTagDTO.MapDTOs(grp.Select(dto => dto.vt)).ToList();
                return playlist;
            });
    }

    public async Task<Playlist?> GetByIdAsync(int id)
    {
        using var conn = dbContext.DbConnection;
        return (await conn.QueryAsync<Playlist, Video, Tag, PlaylistEntryDTO>(@"
        select p.*, v.*, t.*
        from playlist p
        left join playlist_entry pe on p.id = pe.playlistId
        left join video v on pe.videoId = v.id 
        left join tag_video tv on v.id = tv.videoId
        left join tag t on tv.tagId = t.id
        where p.id = @id
        order by pe.entryorder", (playlist, video, tag) => new(playlist, new(video, tag)), new { id }))
            .GroupBy(p => p.playlist.id)
            .Select((grp) =>
            {
                var (playlist, _) = grp.First();
                playlist.entries = VideoTagDTO.MapDTOs(grp.Select(dto => dto.vt)).ToList();
                return playlist;
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

    public async Task<Playlist?> UpdateEntriesAsync(int playlistId, PlaylistEntriesUpdateRequest request)
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
        ", request.toAdd.Select(pe => new { playlistId, pe.videoId, pe.entryorder }), transaction: transaction));
            }

            if (request?.toRemove?.Count > 0)
            {
                tasks.Add(conn.ExecuteAsync(@"
            DELETE FROM playlist_entry WHERE playlistId = @id and videoId = @videoId
        ", request.toRemove.Select(videoId => new { playlistId, videoId }), transaction: transaction));
            }

            if (request?.toUpdate?.Count > 0)
            {
                tasks.Add(conn.ExecuteAsync(@"
            UPDATE playlist_entry SET entryorder = @entryorder
            WHERE playlistId = @playlistId and videoId = @videoId 
        ", request.toUpdate.Select(pe => new { playlistId, pe.videoId, pe.entryorder }), transaction: transaction));
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

public record PlaylistEntryDTO(Playlist playlist, VideoTagDTO vt);