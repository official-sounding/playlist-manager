using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;

public interface IVideoJobQueue
{
    public Guid Enqueue(IVideoJobDetails job);
    public bool TryDequeue([MaybeNullWhen(false)] out QueueEntry entry);
    public bool TryMarkComplete(Guid jobId, JobStatus status, [MaybeNullWhen(false)] out QueueEntry entry);
    public bool TryGetJob(Guid jobId, [MaybeNullWhen(false)] out QueueStatus entry);

    public void UpdateJob(Guid jobId, string update);
    public void CleanupOldJobs();
}

public class VideoJobQueue(ILogger<VideoJobQueue> logger, TimeProvider time) : IVideoJobQueue
{
    private readonly ConcurrentQueue<QueueEntry> jobQueue = new ConcurrentQueue<QueueEntry>();
    private readonly ConcurrentDictionary<Guid, QueueEntry> jobDict = new ConcurrentDictionary<Guid, QueueEntry>();
    private readonly ConcurrentDictionary<Guid, List<string>> jobDetails = new ConcurrentDictionary<Guid, List<string>>();

    public Guid Enqueue(IVideoJobDetails job)
    {
        var jobId = Guid.NewGuid();
        var queueEntry = new QueueEntry(jobId, job, JobStatus.Queued, time.GetUtcNow().UtcDateTime);

        jobDict.TryAdd(jobId, queueEntry);
        jobQueue.Enqueue(queueEntry);

        logger.LogInformation("Job Created with id {jobId}", jobId);

        return jobId;
    }

    public bool TryDequeue([MaybeNullWhen(false)] out QueueEntry entry)
    {
        if (jobQueue.TryDequeue(out var qe) && qe != null)
        {
            entry = qe with { status = JobStatus.Running, startTime = time.GetUtcNow().UtcDateTime };
            jobDict.TryUpdate(entry.id, entry, qe);
            return true;
        }

        logger.LogDebug("No jobs in queue");
        entry = default;
        return false;
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