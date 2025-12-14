namespace University_Self_Service_System___Backend.Entities
{
    public class Course
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
        public string Title { get; set; } = null!;
        public int CreditHours { get; set; }

        // Optional: assigned later through professor management
        public int? ProfessorId { get; set; }
        public Professor? Professor { get; set; }

        // Optional: derived from Professor.FullName when assigned
        public string? InstructorName { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int Capacity { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}
