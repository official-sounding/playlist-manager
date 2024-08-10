using System.Collections.Immutable;
using System.Linq;
using Dapper;
using PlaylistManager.Data;
using PlaylistManager.Data.Models;

public interface IVideoRepository
{
    Task<IEnumerable<Video>> GetAllAsync();
    Task<Video?> GetByIdAsync(long id);
    Task<Video?> GetByYTIdAsync(string ytId);
    Task<IEnumerable<Video>> SearchAsync(string term);
    Task<Video> AddAsync(VideoCreateRequest request);
    Task UpdateAsync(Video video);
    Task<Video?> DeleteByIdAsync(long id);

    Task AddTagAsync(long videoId, long tagId);
    Task RemoveTagAsync(long videoId, long tagId);
}
public class VideoRepository(IDbContext dbContext) : IVideoRepository
{
    public async Task<Video> AddAsync(VideoCreateRequest request)
    {
        using var conn = dbContext.DbConnection;
        conn.Open();
        using var transaction = conn.BeginTransaction();

        try
        {

            var video = await conn.QueryFirstAsync<Video>(@"
            INSERT INTO video (videoId, filename, title, artist, duration, uploadedAt) 
            VALUES (@videoId,@filename,@title, @artist, @duration, @uploadedAt)
            RETURNING *
        ", request);

            if (request.tags is not null)
            {
                await conn.ExecuteAsync("INSERT INTO tag_video (tagId,videoId) VALUES (@tagId, @videoId)", request.tags?.Select(t => new { tagId = t.id, videoId = video.id }));
            }


            transaction.Commit();
            return video with {  tags = request.tags?.ToImmutableArray() };
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<Video?> DeleteByIdAsync(long id)
    {
        using var conn = dbContext.DbConnection;
        return await conn.QueryFirstOrDefaultAsync<Video>(@"
            DELETE FROM video where id = @id
            RETURNING *
        ", new { id });
    }

    public async Task<IEnumerable<Video>> GetAllAsync()
    {
        return await QueryVideos("", null);
    }

    public async Task<Video?> GetByIdAsync(long id)
    {
        return (await QueryVideos("where id = @id", new { id })).FirstOrDefault();
    }

    public async Task<Video?> GetByYTIdAsync(string videoId)
    {
        return (await QueryVideos("where v.videoId = @videoId", new { videoId })).FirstOrDefault();
    }

    public async Task UpdateAsync(Video video)
    {
        using var conn = dbContext.DbConnection;
        conn.Open();
        using var transaction = conn.BeginTransaction();

        try
        {
            await conn.ExecuteAsync(@"
            UPDATE video SET
                videoId=@videoId
                filename=@filename
                title=@title
                artist=@artist
                duration=@duration
                uploadedAt=@uploadedAt
            WHERE id = @id
            ", video, transaction: transaction);

            await conn.ExecuteAsync("DELETE FROM tag_video where videoId = @id", new { video.id }, transaction: transaction);
            if (video.tags is not null)
            {
                await conn.ExecuteAsync("INSERT INTO tag_video (tagId,videoId) VALUES (@tagId, @videoId)", video.tags?.Select(t => new { tagId = t.id, videoId = video.id }));
            }

            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public Task<IEnumerable<Video>> SearchAsync(string term)
    {
        throw new NotImplementedException();
    }

    private async Task<IEnumerable<Video>> QueryVideos(string whereClause, object? parameters)
    {
        using var conn = dbContext.DbConnection;
        var dtos = await conn.QueryAsync<Video, Tag, VideoTagDTO>(@$"select v.*, t.* 
        from video v 
        left join tag_video vt on vt.videoId = v.id
        left join tag t on vt.tagId = t.id {whereClause}", (v, t) => new(v, t), parameters);

        return VideoTagDTO.MapDTOs(dtos);
    }

    public async Task AddTagAsync(long videoId, long tagId)
    {
        using var conn = dbContext.DbConnection;
        await conn.ExecuteAsync("insert or ignore into tag_video (videoId, tagId) Values (@videoId, @tagId)", new { videoId, tagId });
    }

    public async Task RemoveTagAsync(long videoId, long tagId)
    {
        using var conn = dbContext.DbConnection;
        await conn.ExecuteAsync("delete from tag_video where videoId = @videoId and tagId = @tagId", new { videoId, tagId });
    }
}

public record VideoTagDTO(Video video, Tag tag)
{
    public static IEnumerable<Video> MapDTOs(IEnumerable<VideoTagDTO> dtos)
    {
        return dtos
            .GroupBy(vt => vt.video)
            .Select(grp =>
            {
                return grp.Key with { tags = grp.Select(vt => vt.tag).Where(t => t != null).ToImmutableArray() };
            });
    }
}
