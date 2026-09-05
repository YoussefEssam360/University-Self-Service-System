namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class RViewProfessorDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int CourseCount { get; set; }
        //public List<ProfessorCourseDto> CoursesTaught { get; set; } = new();

        // Status flag
        public bool ProfessorNotFound { get; set; } = false;
        public string? Message { get; set; }
    }
}

//    public class ProfessorCourseDto
//    {
//        public string CourseCode { get; set; }
//        public string CourseTitle { get; set; }
//        public int CreditHours { get; set; }
//    }
//}
