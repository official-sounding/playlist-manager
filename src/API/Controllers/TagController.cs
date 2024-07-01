using Microsoft.AspNetCore.Mvc;
using PlaylistManager.Data.Models;

[Route("/api/tag")]
public class TagController(ITagRepository repo) : Controller
{
    [HttpGet("")]
    public async Task<IEnumerable<Tag>> Index()
    {
        return await repo.AllAsync();
    }

    [HttpGet("{id:long}")]
    [Produces(typeof(Tag))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(long id)
    {
        var result = await repo.ByIdAsync(id);
        if (result == null)
        {
            return NotFound();
        }

        return Json(result);
    }

    [HttpPost("")]
    [ProducesResponseType(typeof(Tag), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Create(TagCreateRequest request)
    {
        if (request.title == null)
        {
            return UnprocessableEntity("Required Field is null");
        }
        var result = await repo.CreateAsync(request);
        return Created($"/api/tag/{result.id}", result);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Update(long id, Tag body)
    {
        if (id <= 0)
        {
            return BadRequest("id is invalid");
        }
        if (body.title == null)
        {
            return UnprocessableEntity("Required Field is null");
        }

        var request = body with { id = id };
        await repo.UpdateAsync(request);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound) ]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await repo.DeleteAsync(id);

        if (result == null)
        {
            return NotFound();
        }

        return Json(result);
    }

}