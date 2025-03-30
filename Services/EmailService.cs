using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace InterviewPreparationPortal.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string messageBody)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(emailSettings["FromName"], emailSettings["FromEmail"]));
            email.To.Add(new MailboxAddress("", toEmail));
            email.Subject = subject;
            email.Body = new TextPart("html") { Text = messageBody };

            using (var smtp = new SmtpClient())
            {
                try
                {
                    await smtp.ConnectAsync(emailSettings["SmtpServer"], int.Parse(emailSettings["SmtpPort"]), MailKit.Security.SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(emailSettings["SmtpUsername"], emailSettings["SmtpPassword"]);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                    return true; // ✅ Return true if email is sent successfully
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Email sending failed: {ex.Message}");
                    return false; // ❌ Return false if sending fails
                }
            }
        }
    }
}
