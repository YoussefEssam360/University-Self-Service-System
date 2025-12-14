
namespace University_Self_Service_System___Backend.Entities
{
    public class Course
    {
        internal readonly int Capacity;

        public int Id { get; set; }                 // primary key
        public string Code { get; set; }            // e.g. "CSCI313"
        public string Title { get; set; }
        public int CreditHours { get; set; }

        // optional FK to the professor teaching this course
        public int? ProfessorId { get; set; }
        public Professor Professor { get; set; }

        // navigation: one course → many enrollments
        public ICollection<Enrollment> Enrollments { get; set; }
            = new List<Enrollment>();
        public string InstructorName { get; internal set; }
        public DateTime StartDate { get; internal set; }
        public DateTime EndDate { get; internal set; }
    }
}
