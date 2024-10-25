using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

public class YTDLHealthCheck(IOptions<YTConfig> options) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        if (!ExistsOnPathOrFull(options.Value?.ytdlPath))
        {
            return Task.FromResult(new HealthCheckResult(HealthStatus.Unhealthy, "YTDL does not exist at specified path"));
        }

        if (!ExistsOnPathOrFull(options.Value?.ffmpegPath))
        {
            return Task.FromResult(new HealthCheckResult(HealthStatus.Unhealthy, "FFMpeg does not exist at specified path"));
        }

        return Task.FromResult(new HealthCheckResult(HealthStatus.Healthy, "helper programs exist"));
    }

    public static bool ExistsOnPathOrFull(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName?.Trim()))
        {
            return false;
        }

        if (fileName.Contains(Path.DirectorySeparatorChar))
        {
            return File.Exists(fileName);
        }

        return GetFullPath(fileName) != null;
    }

    public static string? GetFullPath(string fileName)
    {
        if (File.Exists(fileName))
            return Path.GetFullPath(fileName);

        var values = Environment.GetEnvironmentVariable("PATH");
        foreach (var path in (values ?? "").Split(Path.PathSeparator))
        {
            var fullPath = Path.Combine(path, fileName);
            if (File.Exists(fullPath))
                return fullPath;
        }
        return null;
    }
}