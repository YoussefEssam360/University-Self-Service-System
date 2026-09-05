namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class RviewCourseDto
    {
        public int Id { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int CreditHours { get; set; }
        public int? ProfessorId { get; set; }
        public string ProfessorName { get; set; } = "Not Assigned";
        public bool profDontExist { get; set; }
        public List<StudentInCourseDto> EnrolledStudents { get; set; } = new();
        public int Capacity { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
