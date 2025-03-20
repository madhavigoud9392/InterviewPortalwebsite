using InterviewPreparationPortal.Data;
using InterviewPreparationPortal.DTOs;
using InterviewPreparationPortal.Interfaces;
using InterviewPreparationPortal.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace InterviewPreparationPortal.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ✅ Register a new user
        public async Task<User> Register(UserRegisterDTO userDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                throw new Exception("Email already exists.");
            }

            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                Password = userDto.Password // ✅ Storing plain password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        // ✅ Login user and return JWT token
        public async Task<string> Login(UserLoginDTO userDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);

            if (user == null || user.Password != userDto.Password)
            {
                throw new Exception("Invalid email or password.");
            }

            return GenerateJwtToken(user);
        }

        // ✅ Generate JWT Token
        public string GenerateJwtToken(User user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Key"]);


            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
