using System.ComponentModel.DataAnnotations;

namespace InterviewPreparationPortal.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
