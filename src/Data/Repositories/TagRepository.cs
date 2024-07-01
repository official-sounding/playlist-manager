using Dapper;
using PlaylistManager.Data;
using PlaylistManager.Data.Models;

public interface ITagRepository {
    public Task<IEnumerable<Tag>> AllAsync();
    public Task<Tag?> ByIdAsync(long id);
    public Task<Tag> CreateAsync(TagCreateRequest req);
    public Task UpdateAsync(Tag tag);
    public Task<Tag?> DeleteAsync(long id);
}

public class TagRepository(IDbContext dbContext) : ITagRepository
{
    public async Task<IEnumerable<Tag>> AllAsync()
    {
        using var conn = dbContext.DbConnection;
        return await conn.QueryAsync<Tag>("select * from tag");
    }

    public async Task<Tag?> ByIdAsync(long id)
    {
        using var conn = dbContext.DbConnection;
        return await conn.QueryFirstOrDefaultAsync<Tag>("select * from tag where id = @id", new { id });
    }

    public async Task<Tag> CreateAsync(TagCreateRequest request)
    {
        using var conn = dbContext.DbConnection;
        return await conn.QueryFirstAsync<Tag>(@"
            INSERT INTO tag (title) 
            VALUES (@title)
            RETURNING *
        ", request);
    }

    public async Task<Tag?> DeleteAsync(long id)
    {
        using var conn = dbContext.DbConnection;
        return await conn.QueryFirstOrDefaultAsync<Tag>(@"
            DELETE FROM tag where id = @id
            RETURNING *
        ", new { id });
    }

    public async Task UpdateAsync(Tag tag)
    {
        using var conn = dbContext.DbConnection;
        await conn.ExecuteAsync(@"
            UPDATE tag SET
                title=@title
            WHERE id = @id
            ", tag);
    }
}