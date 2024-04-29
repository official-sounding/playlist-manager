using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;

public interface IVideoJobQueue {
    public Guid Enqueue(IVideoJobDetails job);
    public bool TryDequeue([MaybeNullWhen(false)] out QueueEntry entry);
    public bool TryMarkComplete(Guid jobId, QueueStatus status, [MaybeNullWhen(false)] out QueueEntry entry);
    public bool TryGetJob(Guid jobId, [MaybeNullWhen(false)] out QueueEntry entry);
}

public class VideoJobQueue(ILogger <VideoJobQueue> logger, TimeProvider time) : IVideoJobQueue {
    private readonly ConcurrentQueue<QueueEntry> jobQueue = new ConcurrentQueue<QueueEntry>();
    private readonly ConcurrentDictionary<Guid, QueueEntry> jobDict = new ConcurrentDictionary<Guid, QueueEntry>();

    public Guid Enqueue(IVideoJobDetails job) {
        var jobId = Guid.NewGuid();
        var queueEntry = new QueueEntry(jobId, job, QueueStatus.Queued, time.GetUtcNow().UtcDateTime);

        jobDict.TryAdd(jobId, queueEntry);
        jobQueue.Enqueue(queueEntry);

        logger.LogInformation("Job Created with id {jobId}", jobId);

        return jobId;
    }

    public bool TryDequeue([MaybeNullWhen(false)] out QueueEntry entry) {
        if(jobQueue.TryDequeue(out var qe) && qe != null) {
            entry = qe with { status = QueueStatus.Running, startTime = time.GetUtcNow().UtcDateTime };
            jobDict.TryUpdate(entry.id, entry ,qe);
            return true;
        }

        logger.LogDebug("No jobs in queue");
        entry = default;
        return false;
    }

    public bool TryMarkComplete(Guid jobId, QueueStatus status, [MaybeNullWhen(false)] out QueueEntry entry) {
        if(jobDict.TryGetValue(jobId, out var job) && job != null) {
            entry = job;
            jobDict.TryUpdate(jobId, job with { status = status, endTime = time.GetUtcNow().UtcDateTime }, job);
            return true;
        }

        logger.LogWarning("Tried to complete job {jobId} but it was not found", jobId);
        entry = default;
        return false;
    }

    public bool TryGetJob(Guid jobId, [MaybeNullWhen(false)] out QueueEntry entry) {
        return jobDict.TryGetValue(jobId, out entry);
    }
}

public interface IVideoJobDetails{}

public enum QueueStatus {
    Queued,
    Running,
    Success,
    Error
}

public record QueueEntry(Guid id, IVideoJobDetails details, QueueStatus status, DateTime queueTime, DateTime? startTime = null, DateTime? endTime = null) {
    public override string ToString()
    {
        return $"{{ id={id} status={status} type={details?.GetType()} }}";
    }
}