using Microsoft.AspNetCore.Mvc;
using PlaylistManager.Data.Models;

[Route("/api/video")]
public class VideoController(IVideoRepository repo): Controller {

    [HttpGet("")]
    public async Task<IEnumerable<Video>> Index()
    {
        return await repo.GetAllAsync();
    }

    [HttpGet("{id:int}")]
    [Produces(typeof(Video))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await repo.GetByIdAsync(id);
        if(result == null) {
            return NotFound();
        } else {
            return Json(result);
        }
    }

    [HttpPost("")]
    [ProducesResponseType(typeof(Video), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Create(VideoCreateRequest request) 
    {
        if(request?.videoUrl == null || request.filename ==null || request.title == null) 
        {
            return UnprocessableEntity("Required Field is null");
        }
        var result = await repo.AddAsync(request);
        return Created($"/api/video/{result.id}", result);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Update(int id, Video body) 
    {
        if(id <= 0)
        {
            return BadRequest("id is invalid");
        }
        if(body?.videoUrl == null || body.filename ==null || body.title == null) 
        {
            return UnprocessableEntity("Required Field is null");
        }

        var request = new Video{ id = id, videoUrl = body.videoUrl, filename = body.filename, title = body.title };

        await repo.UpdateAsync(request);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(int id) {
        var result = await repo.DeleteByIdAsync(id);

        if(result == null) {
            return NotFound();
        } else {
            return Json(result);
        }
    }

}