namespace InterviewPreparationPortal.DTOs
{
    public class ForgotPasswordRequest
    {
        public string Username { get; set; }  // User's username to fetch the security question
        public string SecurityQuestion { get; set; }  // Security question to verify
    }
}
