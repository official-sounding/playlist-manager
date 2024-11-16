using System.Text;
using Microsoft.AspNetCore.Mvc;
using PlaylistManager.Data.Models;

[Route("/api/playlist")]
public class PlaylistController(PlaylistRepository repo) : Controller
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
    public async Task<IActionResult> Create([FromBody] PlaylistCreateRequest request)
    {
        if (request?.title == null)
        {
            return UnprocessableEntity("Required Field is null");
        }
        var result = await repo.CreateAsync(request);
        return Created($"/api/playlist/{result.id}", result);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Update(int id, [FromBody] List<long> videoIds)
    {
        if (id <= 0)
        {
            return BadRequest("id is invalid");
        }

        var existing = await repo.GetByIdAsync(id);

        if (existing is null)
        {
            return NotFound("playlist not found");
        }

        var body = BuildPayload(existing, videoIds);

        var result = await repo.UpdateEntriesAsync(id, body);
        return Json(result);
    }

    private PlaylistEntriesUpdateRequest BuildPayload(Playlist existing, List<long> videoIds)
    {
        var toAdd = new List<PlaylistEntryChangeRequest>();
        var toUpdate = new List<PlaylistEntryChangeRequest>();
        var toRemove = new List<long>();

        var newVideoIds = videoIds.Select((id, idx) => (id, idx)).ToDictionary();
        var existingVideoIds = existing.entries.Select((v, idx) => (v.id, idx)).ToDictionary();


        foreach (var (id, idx) in newVideoIds)
        {
            var exists = existingVideoIds.TryGetValue(id, out int existingPosition);

            if (!exists)
            {
                toAdd.Add(new(id, idx));
            }

            if (exists && existingPosition != idx)
            {
                toUpdate.Add(new(id, idx));
            }
        }

        foreach (var id in existingVideoIds.Keys)
        {
            if (!newVideoIds.ContainsKey(id))
            {
                toRemove.Add(id);
            }
        }

        return new PlaylistEntriesUpdateRequest(toAdd, toRemove, toUpdate);
    }

    [HttpGet("{id:int}/{filename}.m3u8")]
    public async Task<IActionResult> GetPlaylistFile(int id, string filename)
    {
        if (id <= 0)
        {
            return BadRequest("id is invalid");
        }

        var result = await repo.GetByIdAsync(id);
        if (result == null)
        {
            return NotFound();
        }
        else
        {
            var m3uContent = result.ToM3U();
            var m3uBytes = Encoding.UTF8.GetBytes(m3uContent);
            return File(m3uBytes, "application/mpegurl", $"{filename}.m3u8");
        }

    }
}