using InterviewPreparationPortal.Data;
using InterviewPreparationPortal.Models;
using InterviewPreparationPortal.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity.Data;

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
    public async Task<IActionResult> Register([FromBody] InterviewPreparationPortal.DTOs.RegisterRequest registerRequest)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { message = "Invalid input!" });

        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == registerRequest.Email.ToLower()))
            return BadRequest(new { message = "Email already registered!" });

        var user = new User
        {
            Username = registerRequest.Username ?? "New User",
            Email = registerRequest.Email.ToLower(),
            PasswordHash = HashPassword(registerRequest.Password),
            ExperienceLevel = registerRequest.ExperienceLevel ?? "Beginner",
            Qualification = registerRequest.Qualification ?? "Not Specified",
            Skills = registerRequest.Skills ?? "None",
            SecurityQuestion = registerRequest.SecurityQuestion ?? "Default Question",
            SecurityAnswerHash = HashPassword(registerRequest.SecurityAnswer)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful!" });
    }

    // 📌 Login User
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        if (string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            return BadRequest(new { message = "Email and Password are required!" });

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == loginRequest.Email.ToLower());

        if (existingUser == null || !VerifyPassword(loginRequest.Password, existingUser.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials!" });

        string token = GenerateJwtToken(existingUser);
        return Ok(new
        {
            message = "Login successful!",
            token,
            user = new
            {
                existingUser.Id,
                existingUser.Username,
                existingUser.Email,
                existingUser.ExperienceLevel,
                existingUser.Qualification,
                existingUser.Skills
            }
        });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var token = Request.Headers["Authorization"].ToString();
        Console.WriteLine($"🔍 Received Token: {token}");

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            Console.WriteLine("❌ Invalid or missing token.");
            return Unauthorized(new { message = "Invalid token!" });
        }

        Console.WriteLine($"✅ Valid Token for User ID: {userId}");

        var user = await _context.Users.FindAsync(int.Parse(userId));
        if (user == null)
            return NotFound(new { message = "User not found!" });

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.ExperienceLevel,
            user.Qualification,
            user.Skills
        });
    }




    // 📌 Forgot Password - Get Security Question
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest model)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == model.Email.ToLower());
        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(new { securityQuestion = user.SecurityQuestion });
    }

    // 📌 Verify Security Answer and Reset Password
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest model)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == model.Email.ToLower());
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (!BCrypt.Net.BCrypt.Verify(model.SecurityAnswer, user.SecurityAnswerHash))
            return Unauthorized(new { message = "Incorrect security answer" });

        user.PasswordHash = HashPassword(model.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password reset successful!" });
    }

    // 📌 Helper Methods

    // 🔹 Generate JWT Token
    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_config["JwtSettings:Key"]);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("ExperienceLevel", user.ExperienceLevel),
                new Claim("Qualification", user.Qualification),
                new Claim("Skills", user.Skills)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = _config["JwtSettings:Issuer"],
            Audience = _config["JwtSettings:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    // 🔹 Hash password securely
    private string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    // 🔹 Verify hashed password
    private bool VerifyPassword(string inputPassword, string storedHash)
    {
        return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
    }

    [Authorize]
    [HttpGet("protected")]
    public IActionResult ProtectedRoute()
    {
        return Ok(new { message = "This is a protected route!" });
    }
}

// 📌 Request DTOs
public class LoginRequest
{
    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}

public class ForgotPasswordRequest
{
    [Required]
    public string Email { get; set; }
}

public class ResetPasswordRequest
{
    [Required]
    public string Email { get; set; }

    [Required]
    public string SecurityAnswer { get; set; }

    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; }
}
