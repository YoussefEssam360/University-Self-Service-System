namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class RupdateCourse
    {
        public bool done { get; set; }
        public string? Message { get; set; }
        public bool CourseNotFound { get; set; }
        public bool CourseCodeIsDuplicate { get; set; }
        public bool ProfessorIdNotFound { get; set; }
    }
}
