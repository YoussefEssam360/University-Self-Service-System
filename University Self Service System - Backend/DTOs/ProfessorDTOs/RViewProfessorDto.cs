namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class RViewProfessorDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }
        public int CourseCount { get; set; }
        //public List<ProfessorCourseDto> CoursesTaught { get; set; } = new();

        // Status flag
        public bool ProfessorNotFound { get; set; } = false;
    }
}

//    public class ProfessorCourseDto
//    {
//        public string CourseCode { get; set; }
//        public string CourseTitle { get; set; }
//        public int CreditHours { get; set; }
//    }
//}