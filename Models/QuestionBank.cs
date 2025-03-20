using System.ComponentModel.DataAnnotations;

namespace InterviewPreparationPortal.Models
{
    public class QuestionBank
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Question { get; set; }

        [Required]
        public string Answer { get; set; }

        [Required]
        public string Category { get; set; } // e.g., C, C++, Java, Python
    }
}
