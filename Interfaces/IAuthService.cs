using InterviewPreparationPortal.Models;
using InterviewPreparationPortal.DTOs;
using System.Threading.Tasks;

namespace InterviewPreparationPortal.Interfaces
{
    public interface IAuthService
    {
        Task<User> Register(UserRegisterDTO userDto);
        Task<string> Login(UserLoginDTO userDto);
        string GenerateJwtToken(User user);  // ✅ Added this line
    }
}
