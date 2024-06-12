using Microsoft.AspNetCore.Mvc;
using PlaylistManager.Data.Models;

[Route("/api/playlist")]
public class PlaylistController(PlaylistRepository repo): Controller 
{
    [HttpGet("")]
    public async Task<IEnumerable<Playlist>> Index()
    {
        return await repo.GetAllAsync();
    }

    [HttpGet("{id:int}")]
    [Produces(typeof(Playlist))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await repo.GetByIdAsync(id);
        if (result == null)
        {
            return NotFound();
        }
        else
        {
            return Json(result);
        }
    }

    [HttpPost("")]
    [ProducesResponseType(typeof(Playlist), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Create(PlaylistCreateRequest request)
    {
        if (request?.title == null)
        {
            return UnprocessableEntity("Required Field is null");
        }
        var result = await repo.CreateAsync(request);
        return Created($"/api/playlist/{result.id}", result);
    }

    [HttpPut("{id:int}/entries")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Update(int id, PlaylistEntryUpdateRequest body)
    {
        if (id <= 0)
        {
            return BadRequest("id is invalid");
        }

        var result = await repo.UpdateEntriesAsync(id, body);
        return Json(result);
    }
}