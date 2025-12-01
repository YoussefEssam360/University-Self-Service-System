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
        // In your AppDbContext.cs file:

        // In your AppDbContext.cs file (Updated Fluent API):

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ... other configurations ...

            // 1. Configure Course <-> Enrollment Relationship
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments) // Explicitly link to the Enrollments collection in Course.cs
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade Delete for Course

            // 2. Configure Student <-> Enrollment Relationship
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(s => s.Enrollments) // Explicitly link to the Enrollments collection in Student.cs
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade Delete for Student

            base.OnModelCreating(modelBuilder);
        }
    }
}

