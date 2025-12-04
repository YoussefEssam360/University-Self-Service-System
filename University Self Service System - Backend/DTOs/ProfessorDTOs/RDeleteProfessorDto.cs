namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class RDeleteProfessorDto
    {
        public bool Success { get; set; } = false;
        public bool ProfessorNotFound { get; set; } = false;
        //public bool HasAssignedCourses { get; set; } = false;
        //public int CourseCount { get; set; } = 0;
    }
}