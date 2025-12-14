namespace University_Self_Service_System___Backend.Entities
{
    // Entities/Student.cs
    public class Student
    {
        internal object User;

        public int Id { get; set; }                 // primary key

        // Link to the User account (one-to-one)
        public int UserId { get; set; }
        public User User { get; set; }

        // profile fields (kept for display/search)
        public string Name { get; set; }
        public string Email { get; set; }

        // navigation: one student → many enrollments
        public ICollection<Enrollment> Enrollments { get; set; }
            = new List<Enrollment>();
    }
}
