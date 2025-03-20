using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize] // 🔒 This secures the entire controller
[Route("api/protected")]
[ApiController]
public class ProtectedController : ControllerBase
{
    [HttpGet]
    public IActionResult GetSecureData()
    {
        return Ok(new { Message = "You are authenticated!" });
    }
}
