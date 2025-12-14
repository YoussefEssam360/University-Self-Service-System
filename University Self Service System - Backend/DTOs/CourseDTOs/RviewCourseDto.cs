namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class RviewCourseDto
    {
        // These are the core identification and display fields
        public string CourseCode { get; set; }   // Maps to Entity.Code
        public string Title { get; set; }

        // Academic details the user needs to know
        public int CreditHours { get; set; }

        // Details about the related Professor (essential for a course list)
        // You should *project* the professor's name here, instead of just the ID.
        public string ProfessorName { get; set; }
        public bool profDontExist { get; set; } = false;

        // List of enrolled students for admin/student pages
        public List<StudentInCourseDto> EnrolledStudents { get; set; } = new();
    }
}
