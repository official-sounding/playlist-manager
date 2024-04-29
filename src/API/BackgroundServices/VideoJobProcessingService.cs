
public class VideoJobProcessingService(ILogger<VideoJobProcessingService> logger, IVideoJobQueue queue, VideoService videoService) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Queue Process Started");
        while(!stoppingToken.IsCancellationRequested) {
            if(queue.TryDequeue(out var queueItem)) {
                logger.LogInformation("Starting Video Job {queueItem}", queueItem);
                try {
                    await RunQueueItem(queueItem, stoppingToken);
                    queue.TryMarkComplete(queueItem.id, QueueStatus.Success, out var success);
                    logger.LogInformation("Video Job {queueItem} completed successfully", success);
                } catch (Exception e) {
                    
                    queue.TryMarkComplete(queueItem.id, QueueStatus.Error, out var err);
                    logger.LogError(e, "Video Job {err} failed to process", err);
                }
            }
            await Task.Delay(1000);
        }
        logger.LogInformation("Queue Process Exiting");
    }

    private async Task RunQueueItem(QueueEntry item, CancellationToken ct) {

        await (item.details switch {
            DownloadRequest dlreq => videoService.DownloadVideoAsync(dlreq.url, ct),
            ImportRequest imreq => ImportFiles(imreq, ct),
            _ => Task.CompletedTask
        });
    }

    private async Task ImportFiles(ImportRequest req, CancellationToken ct) {
        foreach(var file in req.filenames) {
            await videoService.EnrichVideoAsync(file, ct);
        }
    }
}