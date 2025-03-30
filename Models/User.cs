using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterviewPreparationPortal.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]  // ✅ Auto-increment ID
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = "New User";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ExperienceLevel { get; set; } = "Beginner";

        [Required]
        [MaxLength(100)]
        public string Qualification { get; set; } = "Not Specified";

        [Required]
        public string Skills { get; set; } = "None";

        public string SecurityQuestion { get; set; }

        [Required]
        public string SecurityAnswerHash { get; set; } = string.Empty;
    }
}
