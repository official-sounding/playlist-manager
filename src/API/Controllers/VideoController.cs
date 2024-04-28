using Microsoft.AspNetCore.Mvc;

[Route("/video")]
public class VideoController(): Controller {

    [HttpGet("/")]
    public string Index()
    {
        return "Hello World";
    }
}