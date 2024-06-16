using System.Collections.Concurrent;
using System.Collections.Immutable;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Channels;

public interface IVideoJobQueue
{
    public Guid Enqueue(IVideoJobDetails job);
    IEnumerable<QueueEntry> ConsumeBlocking(CancellationToken ct);
    public bool TryMarkComplete(Guid jobId, JobStatus status, [MaybeNullWhen(false)] out QueueEntry entry);
    public bool TryGetJob(Guid jobId, [MaybeNullWhen(false)] out QueueStatus entry);
    public IEnumerable<QueueEntry> GetAll();
    public void UpdateJob(Guid jobId, string update);
    public void CleanupOldJobs();

    Task WriteLogAsync(QueueLog log);
    Task ConsumeLogAsync(CancellationToken ct, Func<QueueLog, Task> consumer);
}

public class VideoJobQueue(ILogger<VideoJobQueue> logger, TimeProvider time) : IVideoJobQueue
{
    private readonly BlockingCollection<QueueEntry> jobQueue = new BlockingCollection<QueueEntry>();

    private ImmutableHashSet<ChannelWriter<QueueLog>> writers = ImmutableHashSet<ChannelWriter<QueueLog>>.Empty;

    private readonly ConcurrentDictionary<Guid, QueueEntry> jobDict = new ConcurrentDictionary<Guid, QueueEntry>();
    private readonly ConcurrentDictionary<Guid, List<string>> jobDetails = new ConcurrentDictionary<Guid, List<string>>();

    public Guid Enqueue(IVideoJobDetails job)
    {
        var jobId = Guid.NewGuid();
        var queueEntry = new QueueEntry(jobId, job, JobStatus.Queued, time.GetUtcNow().UtcDateTime);

        jobDict.TryAdd(jobId, queueEntry);
        jobQueue.Add(queueEntry);

        logger.LogInformation("Job Created with id {jobId}", jobId);

        return jobId;
    }

    public IEnumerable<QueueEntry> ConsumeBlocking(CancellationToken ct)
    {
        foreach(var qe in jobQueue.GetConsumingEnumerable(ct))
        {
            var entry = qe with { status = JobStatus.Running, startTime = time.GetUtcNow().UtcDateTime };
            jobDict.TryUpdate(entry.id, entry, qe);
            yield return entry;
        }
    }

    public bool TryMarkComplete(Guid jobId, JobStatus status, [MaybeNullWhen(false)] out QueueEntry entry)
    {
        if (jobDict.TryGetValue(jobId, out var job) && job != null)
        {
            entry = job;
            jobDict.TryUpdate(jobId, job with { status = status, endTime = time.GetUtcNow().UtcDateTime }, job);
            return true;
        }

        logger.LogWarning("Tried to complete job {jobId} but it was not found", jobId);
        entry = default;
        return false;
    }

    public IEnumerable<QueueEntry> GetAll() {
        return jobDict.Select(j => j.Value);
    }

    public bool TryGetJob(Guid jobId, [MaybeNullWhen(false)] out QueueStatus entry)
    {
        if (jobDict.TryGetValue(jobId, out var job))
        {
            jobDetails.TryGetValue(jobId, out var details);
            entry = new(job, details ?? new List<string>());
            return true;
        }

        entry = default;
        return false;
    }

    public void CleanupOldJobs()
    {
        var jobsToRemove = new List<Guid>();
        foreach (var job in jobDict.Values)
        {
            if (job != null && (time.GetUtcNow().UtcDateTime - job.endTime)?.TotalMinutes > 30)
            {
                jobsToRemove.Add(job.id);
            }
        }

        logger.LogDebug("found {count} jobs to remove", jobsToRemove.Count);

        foreach (var jobId in jobsToRemove)
        {
            logger.LogDebug("removing job {jobId}", jobId);
            jobDict.TryRemove(jobId, out _);
        }
    }

    public void UpdateJob(Guid jobId, string update)
    {
        var details = jobDetails.GetOrAdd(jobId, new List<string>());
        details.Add(update);
    }

    public async Task WriteLogAsync(QueueLog log)
    {
        foreach(var writer in writers) {
            await writer.WriteAsync(log);
        }
    }

    public async Task ConsumeLogAsync(CancellationToken ct, Func<QueueLog, Task> consumer)
    {
        var channel = Channel.CreateUnbounded<QueueLog>();
        ImmutableInterlocked.Update(ref writers, (writers, item) => writers.Add(item), channel.Writer);

        await foreach (var item in channel.Reader.ReadAllAsync(ct)) {
            await consumer(item);
        }

       ImmutableInterlocked.Update(ref writers, (writers, item) => writers.Remove(item), channel.Writer);
    }
}

public interface IVideoJobDetails { }

public enum JobStatus
{
    Queued,
    Running,
    Success,
    Error
}

public record QueueEntry(Guid id, IVideoJobDetails details, JobStatus status, DateTime queueTime, DateTime? startTime = null, DateTime? endTime = null)
{
    public override string ToString()
    {
        return $"{{ id={id} status={status} type={details?.GetType()} }}";
    }
}

public record QueueStatus(QueueEntry job, List<string> statusUpdates);
public record QueueLog(Guid id, JobStatus status, DateTime date, string entry);