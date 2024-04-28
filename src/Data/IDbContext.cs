using System.Data;
namespace PlaylistManager.Data;

public interface IDbContext
{
    IDbConnection DbConnection { get; }
}

