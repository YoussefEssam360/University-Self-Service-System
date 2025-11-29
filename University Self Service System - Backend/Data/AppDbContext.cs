using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        
        public DbSet<Student> Students { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Professor> Professors { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<User> Users { get; set; }

        // --- Configuration for Data Constraints ---
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 1. Enforce Unique Course Code
            
            modelBuilder.Entity<Course>()
                .HasIndex(c => c.Code)
                .IsUnique();

            
            base.OnModelCreating(modelBuilder);
        }
    }
}