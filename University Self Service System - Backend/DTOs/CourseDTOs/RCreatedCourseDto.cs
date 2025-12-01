namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class RCreatedCourseDto
    {
        public int Id { get; set; } 

        public bool ProfessorIdNotFound { get; set; } = false;

        public bool CourseCodeIsDuplicate { get; set; } = false;
    }
}
