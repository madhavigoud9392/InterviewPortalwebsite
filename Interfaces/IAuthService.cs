using InterviewPreparationPortal.DTOs;
using InterviewPreparationPortal.Models;
using System.Threading.Tasks;

namespace InterviewPreparationPortal.Interfaces  // ✅ Corrected namespace
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterAsync(RegisterRequest registerRequest);
        Task<(bool Success, string Token, User User)> LoginAsync(LoginRequest loginRequest);
        Task<User> GetUserProfileAsync(int userId);
        Task<string> GetSecurityQuestionAsync(string email);
        Task<(bool Success, string Message)> ResetPasswordAsync(ResetPasswordRequest model);
    }
}
