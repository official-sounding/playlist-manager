using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;
using PlaylistManager.Data;

public class SqliteDbContext(IConfiguration config) : IDbContext
{
    public IDbConnection DbConnection => new SqliteConnection(config.GetConnectionString("main"));
}