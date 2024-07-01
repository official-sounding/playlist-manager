using System.Collections.Immutable;
using Dapper;
using PlaylistManager.Data;
using PlaylistManager.Data.Models;

public interface IVideoRepository
{
    Task<IEnumerable<Video>> GetAllAsync();
    Task<Video?> GetByIdAsync(int id);
    Task<Video?> GetByYTIdAsync(string ytId);
    Task<IEnumerable<Video>> SearchAsync(string term);
    Task<Video> AddAsync(VideoCreateRequest request);
    Task UpdateAsync(Video video);
    Task<Video?> DeleteByIdAsync(int id);
}
public class VideoRepository(IDbContext dbContext) : IVideoRepository
{
    public async Task<Video> AddAsync(VideoCreateRequest request)
    {
        using var conn = dbContext.DbConnection;
        return await conn.QueryFirstAsync<Video>(@"
            INSERT INTO video (videoId, filename, title, artist, duration, uploadedAt) 
            VALUES (@videoId,@filename,@title, @artist, @duration, @uploadedAt)
            RETURNING *
        ", request);
    }

    public async Task<Video?> DeleteByIdAsync(int id)
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

    public async Task<Video?> GetByIdAsync(int id)
    {
        return (await QueryVideos("where id = @id", new { id })).FirstOrDefault();
    }

    public async Task<Video?> GetByYTIdAsync(string videoId)
    {
        return (await QueryVideos("where videoId = @videoId", new { videoId })).FirstOrDefault();
    }

    public async Task UpdateAsync(Video video)
    {
        using var conn = dbContext.DbConnection;
        await conn.ExecuteAsync(@"
            UPDATE video SET
                videoId=@videoId
                filename=@filename
                title=@title
                artist=@artist
                duration=@duration
                uploadedAt=@uploadedAt
            WHERE id = @id
            ", video);
    }

    public Task<IEnumerable<Video>> SearchAsync(string term)
    {
        throw new NotImplementedException();
    }

    private async Task<IEnumerable<Video>> QueryVideos(string whereClause, object? parameters) {
        using var conn = dbContext.DbConnection;
        var dtos = await conn.QueryAsync<Video, Tag, VideoTagDTO>(@$"select v.*, t.* 
        from video v 
        left join tag_video vt on vt.videoId = v.id
        left join tag t on vt.tagId = t.id {whereClause}", (v,t) => new(v,t));

        return VideoTagDTO.MapDTOs(dtos);
    }
}

public record VideoTagDTO(Video video, Tag tag) {
    public static IEnumerable<Video> MapDTOs(IEnumerable<VideoTagDTO> dtos) {
        return dtos
            .GroupBy(vt => vt.video)
            .Select(grp => {
                return grp.Key with { tags = grp.Select(vt => vt.tag).Where(t => t != null).ToImmutableArray() };
        });
    }
}