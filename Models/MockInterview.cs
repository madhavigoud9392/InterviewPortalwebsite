using System.ComponentModel.DataAnnotations;

namespace InterviewPreparationPortal.Models
{
    public class MockInterview
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CandidateName { get; set; }

        [Required]
        public string Interviewer { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Feedback { get; set; }
    }
}
