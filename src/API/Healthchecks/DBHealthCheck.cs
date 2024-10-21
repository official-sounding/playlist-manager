using Dapper;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using PlaylistManager.Data;

public class DBHealthCheck(IDbContext dbContext) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try {
            using var conn = dbContext.DbConnection;
            var result = await conn.QueryFirstAsync<int>("select * from video");
            return HealthCheckResult.Healthy($"DB Good: {result} videos");
        } catch(Exception e) {
            return 
            new HealthCheckResult(
                context.Registration.FailureStatus, "Exception occured", e);
        }
    }
}