using System.ComponentModel.DataAnnotations;

namespace InterviewPreparationPortal.DTOs
{
    public class ResetPasswordRequest
    {
        [Required]
        public string Username { get; set; }  // Username instead of Email

        [Required]
        public string SecurityQuestion { get; set; }  // Security Question

        [Required]
        public string SecurityAnswer { get; set; }  // Security Answer to the security question

        [Required]
        [MinLength(8)] // Enforce minimum password length
        public string NewPassword { get; set; }  // New password to set
    }
}
