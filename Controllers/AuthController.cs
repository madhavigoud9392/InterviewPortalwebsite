using InterviewPreparationPortal.Data;
using InterviewPreparationPortal.Models;
using InterviewPreparationPortal.DTOs; // Ensure correct namespace
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // 📌 Register User
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
    {
        if (await _context.Users.AnyAsync(u => u.Email == registerRequest.Email))
        {
            return BadRequest(new { message = "Email already exists!" });
        }

        var user = new User
        {
            Username = registerRequest.Username ?? string.Empty,
            Email = registerRequest.Email ?? string.Empty,
            Password = HashPassword(registerRequest.Password ?? string.Empty) // 🔥 Fix: Use Password
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful!" });
    }

    // 📌 Login User
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

        if (existingUser == null || !VerifyPassword(loginRequest.Password ?? string.Empty, existingUser.Password))
        {
            return Unauthorized(new { message = "Invalid credentials!" });
        }

        string token = GenerateJwtToken(existingUser);
        return Ok(new { message = "Login successful!", token });
    }

    // 🔹 Hash password securely using BCrypt
    private string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    // 🔹 Verify hashed password
    private bool VerifyPassword(string inputPassword, string storedHash)
    {
        return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
    }

    // 🔹 Generate JWT Token
    private string GenerateJwtToken(User user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user));
        }

        var tokenHandler = new JwtSecurityTokenHandler();
       
        var key = Encoding.ASCII.GetBytes(_config["JwtSettings:Key"]);
        // 🔥 Fix: Use `_config` and "Key"

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
