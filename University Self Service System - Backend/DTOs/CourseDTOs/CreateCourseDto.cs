namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class CreateCourseDto
    {
        public string Code { get; set; }        // e.g. "CSCI313"
        public string Title { get; set; }
        public int CreditHours { get; set; }

        // optional: assign a professor at creation
        public int? ProfessorId { get; set; }
    }
}

