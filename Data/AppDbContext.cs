using Microsoft.EntityFrameworkCore;
using InterviewPreparationPortal.Models;

namespace InterviewPreparationPortal.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } // Table for storing users
    }
}
