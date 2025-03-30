using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InterviewPreparationPortal.Models;
using InterviewPreparationPortal.Data;
using InterviewPreparationPortal.DTOs;  // ✅ Using DTO correctly

namespace InterviewPreparationPortal.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model) // ✅ Using DTO
        {
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                return BadRequest(new { message = "Email already exists" });

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                ExperienceLevel = model.ExperienceLevel,
                Qualification = model.Qualification,
                Skills = model.Skills,
                SecurityQuestion = model.SecurityQuestion,
                SecurityAnswerHash = BCrypt.Net.BCrypt.HashPassword(model.SecurityAnswer)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User registered successfully" });
        }

        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetUserProfile(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Username,
                    u.Email,
                    Experience = u.ExperienceLevel,
                    u.Qualification,
                    u.Skills,
                    ProfileImage = "/images/profile-placeholder.png"  // ✅ Fixed image for all users
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }



    }
}
