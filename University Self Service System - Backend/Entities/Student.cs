namespace University_Self_Service_System___Backend.Entities
{
    // Entities/Student.cs
    public class Student
    {
        public int Id { get; set; }                 // primary key

        public string Name { get; set; }
        public string Email { get; set; }

        // navigation: one student → many enrollments
        public ICollection<Enrollment> Enrollments { get; set; }
            = new List<Enrollment>();
    }
}
