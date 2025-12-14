namespace University_Self_Service_System___Backend.Entities
{
    // Entities/Student.cs
    public class Student
    {
        public int Id { get; set; }                 // primary key

        // Link to the User account (one-to-one)
        public int UserId { get; set; }
        public User User { get; set; } = null!;     // EF will populate; use null-forgiving to silence warnings

        // profile fields (kept for display/search)
        // keep existing fields, and add the fields your teammates referenced
        public string Name { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string StudentNumber { get; set; } = null!;
        public DateTime? DateOfBirth { get; set; }
        public string Major { get; set; } = null!;
        public string Email { get; set; } = null!;

        // navigation: one student → many enrollments
        public ICollection<Enrollment> Enrollments { get; set; }
            = new List<Enrollment>();
    }
}
