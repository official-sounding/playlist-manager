using Dapper;
using PlaylistManager.Data;
using PlaylistManager.Data.Models;

public interface IVideoRepository
{
    Task<IEnumerable<Video>> GetAllAsync();
    Task<Video?> GetByIdAsync(int id);
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
        using var conn = dbContext.DbConnection;
        return await conn.QueryAsync<Video>("select * from video");
    }

    public async Task<Video?> GetByIdAsync(int id)
    {
        using var conn = dbContext.DbConnection;
        return await conn.QueryFirstOrDefaultAsync<Video>("select * from video where id = @id", new { id });
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
}