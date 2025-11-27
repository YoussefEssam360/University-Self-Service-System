namespace University_Self_Service_System___Backend.Entities
{
    // Join table between Student and Course
    public class Enrollment
    {
        public int Id { get; set; }                 // primary key

        // FK to Student
        public int StudentId { get; set; }
        public Student Student { get; set; }

        // FK to Course
        public int CourseId { get; set; }
        public Course Course { get; set; }

        // null if not graded yet
        public double? Grade { get; set; }
    }
}
