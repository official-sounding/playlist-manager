using Microsoft.AspNetCore.Mvc;
using PlaylistManager.Data.Models;

[Route("/api/video")]
public class VideoController(IVideoRepository repo, ITagRepository tagRepo, VideoService svc, IVideoJobQueue jobQueue) : Controller
{

    [HttpGet("")]
    public async Task<IEnumerable<Video>> Index()
    {
        return await repo.GetAllAsync();
    }

    [HttpGet("{id:long}")]
    [Produces(typeof(Video))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(long id)
    {
        var result = await repo.GetByIdAsync(id);
        if (result == null)
        {
            return NotFound();
        }

        return Json(result);
    }

    [HttpGet("{id:long}/data")]
    public async Task<IActionResult> GetDataById(long id)
    {
        var stream = await svc.FileStreamById(id);

        if (stream == null)
        {
            return NotFound();
        }

        return File(stream, "video/mp4", enableRangeProcessing: true);
    }

    [HttpPost("")]
    [ProducesResponseType(typeof(Video), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Create(VideoCreateRequest request)
    {
        if (request?.videoId == null || request.filename == null || request.title == null)
        {
            return UnprocessableEntity("Required Field is null");
        }
        var result = await repo.AddAsync(request);
        return Created($"/api/video/{result.id}", result);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Update(long id, Video body)
    {
        if (id <= 0)
        {
            return BadRequest("id is invalid");
        }
        if (body?.videoId == null || body.filename == null || body.title == null)
        {
            return UnprocessableEntity("Required Field is null");
        }

        var request = body with { id = id };
        await repo.UpdateAsync(request);
        return NoContent();
    }

    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(long id)
    {
        var result = await repo.DeleteByIdAsync(id);

        if (result == null)
        {
            return NotFound();
        }

        return Json(result);
    }

    [HttpPost("{videoId:long}/tag/{tagId:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> AddTagToVideo(long videoId, long tagId)
    {
        await repo.AddTagAsync(videoId, tagId);
        return NoContent();
    }

    [HttpPost("{videoId:long}/tag")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> AddNewTagToVideo(long videoId, [FromBody] TagCreateRequest req)
    {
        var tag = await tagRepo.CreateAsync(req);
        await repo.AddTagAsync(videoId, tag.id);

        return Json(tag);
    }

    [HttpDelete("{videoId:long}/tag/{tagId:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> RemoveTagFromVideo(long videoId, long tagId)
    {
        await repo.RemoveTagAsync(videoId, tagId);
        return NoContent();
    }


    [HttpPost("download")]
    public async Task<IActionResult> DownloadFromUrl([FromBody] DownloadRequest req)
    {
        var valid = await svc.ValidateDownload(req.url);

        if (!valid)
        {
            return Conflict();
        }

        var id = jobQueue.Enqueue(req);
        var result = new QueueResult($"/api/video/job/{id}", id);
        return Accepted(result.uri, result);
    }

    [HttpPost("import")]
    public IActionResult ImportFiles([FromBody] ImportRequest req)
    {
        var id = jobQueue.Enqueue(req);
        var result = new QueueResult($"/api/video/job/{id}", id);
        return Accepted(result.uri, result);
    }

    [HttpGet("job")]
    public IActionResult GetJobs()
    {
        return Json(jobQueue.GetAll());
    }

    [HttpGet("job/{jobId:guid}")]
    public IActionResult GetJobStatus(Guid jobId)
    {
        if (jobQueue.TryGetJob(jobId, out var job))
        {
            return Json(job);
        }

        return NotFound();
    }
}

public record DownloadRequest(string url, IEnumerable<string>? tags = null) : IVideoJobDetails { public string JobType => "Download Request"; }
public record ImportRequest(IEnumerable<string> filenames, IEnumerable<string>? tags = null) : IVideoJobDetails { public string JobType => "Import Request"; }
public record QueueResult(string uri, Guid jobId);