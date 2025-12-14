namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class StudentInCourseDto
    {
        public int StudentId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        // optional: grade
        public double? Grade { get; set; }
    }
}
