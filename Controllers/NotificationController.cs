using Microsoft.AspNetCore.Mvc;
using InterviewPreparationPortal.Data;
using InterviewPreparationPortal.Models;
using InterviewPreparationPortal.Services; // Import EmailService
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;

namespace InterviewPreparationPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService; // ✅ Inject EmailService

        public NotificationController(AppDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // ✅ 1. Create a new notification and send an email
        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] Notification notification)
        {
            if (notification == null)
            {
                return BadRequest(new { message = "Invalid notification data." });
            }

            var user = await _context.Users.FindAsync(notification.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            notification.UserEmail = user.Email;
            notification.SentDate = DateTime.UtcNow;

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // ✅ Send email notification
            // ✅ Send Email Notification
            string emailSubject = notification.Subject;
            string emailBody = $"<p>{notification.Message}</p><br><small>Sent at: {notification.SentDate}</small>";
            bool emailSent = await _emailService.SendEmailAsync(user.Email, emailSubject, emailBody);

            if (!emailSent)
            {
                return Ok(new { message = "Notification created, but email sending failed." });
            }

            return Ok(new { message = "Notification created and email sent." });
        }
    

        // ✅ 2. Get all notifications for a user
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserNotifications(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.SentDate)
                .ToListAsync();

            if (!notifications.Any())
            {
                return NotFound(new { message = "No notifications found for this user." });
            }

            return Ok(notifications);
        }

        // ✅ 3. Get all notifications (Admin View)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllNotifications()
        {
            var notifications = await _context.Notifications
                .OrderByDescending(n => n.SentDate)
                .ToListAsync();

            return Ok(notifications);
        }

        // ✅ 4. Get a notification by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationById(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
            {
                return NotFound(new { message = "Notification not found." });
            }

            return Ok(notification);
        }

        // ✅ 5. Delete a notification by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                return NotFound(new { message = "Notification not found." });
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification deleted successfully." });
        }

        // ✅ 6. Update a notification by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNotification(int id, [FromBody] Notification updatedNotification)
        {
            if (updatedNotification == null || id != updatedNotification.Id)
            {
                return BadRequest(new { message = "Invalid notification data." });
            }

            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                return NotFound(new { message = "Notification not found." });
            }

            var user = await _context.Users.FindAsync(updatedNotification.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            notification.Subject = updatedNotification.Subject;
            notification.Message = updatedNotification.Message;
            notification.SentDate = DateTime.UtcNow;
            notification.UserEmail = user.Email; // ✅ Ensure UserEmail is updated

            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification updated successfully." });
        }
    }
}
