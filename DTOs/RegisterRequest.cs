using System.ComponentModel.DataAnnotations;

namespace InterviewPreparationPortal.DTOs
{
    public class RegisterRequest
    {
        [Required]
        public string Username { get; set; }  // ✅ Ensure this property exists

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string Password { get; set; }

        [Required]
        public string ExperienceLevel { get; set; }  // ✅ Ensure this property exists

        [Required]
        public string Qualification { get; set; }  // ✅ Ensure this property exists

        [Required]
        public string Skills { get; set; }  // ✅ Ensure this property exists

        [Required]
        public string SecurityQuestion { get; set; }  // ✅ Ensure this property exists

        [Required]
        public string SecurityAnswer { get; set; }  // ✅ Ensure this property exists
    }
}
