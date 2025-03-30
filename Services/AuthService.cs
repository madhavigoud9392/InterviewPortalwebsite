using InterviewPreparationPortal.Data;
using InterviewPreparationPortal.Interfaces;  // ✅ Ensure this is at the top
using InterviewPreparationPortal.Models;
using InterviewPreparationPortal.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace InterviewPreparationPortal.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // 📌 Register User
        public async Task<(bool Success, string Message)> RegisterAsync(RegisterRequest registerRequest)
        {
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == registerRequest.Email.ToLower()))
            {
                return (false, "Email already registered!");
            }

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

            return (true, "Registration successful!");
        }

        // 📌 Login User
        public async Task<(bool Success, string Token, User User)> LoginAsync(LoginRequest loginRequest)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == loginRequest.Email.ToLower());

            if (user == null || !VerifyPassword(loginRequest.Password, user.PasswordHash))
            {
                return (false, null, null);
            }

            string token = GenerateJwtToken(user);
            return (true, token, user);
        }

        // 📌 Get Security Question for Forgot Password
        public async Task<string> GetSecurityQuestionAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
            return user?.SecurityQuestion ?? "No security question found!";
        }

        // 📌 Reset Password
        public async Task<(bool Success, string Message)> ResetPasswordAsync(ResetPasswordRequest model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == model.Email.ToLower());
            if (user == null)
                return (false, "User not found!");

            if (!VerifyPassword(model.SecurityAnswer, user.SecurityAnswerHash))
                return (false, "Incorrect security answer!");

            user.PasswordHash = HashPassword(model.NewPassword);
            await _context.SaveChangesAsync();

            return (true, "Password reset successful!");
        }

        // 📌 Generate JWT Token
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

        // 📌 Hash Password
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // 📌 Verify Password
        private bool VerifyPassword(string inputPassword, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
        }

        public Task<User> GetUserProfileAsync(int userId)
        {
            throw new NotImplementedException();
        }
    }
}
