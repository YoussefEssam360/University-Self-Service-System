using System

namespace University_Self_Service_System___Backend.DTOs.StudentDTOs
{
    
    public class EnrolledCourseDto
    {
        public int EnrollmentId { get; set; } 
        public int CourseId { get; set; }
        public string? CourseTitle { get; set; }
        public string? CourseCode { get; set; }
        public string? InstructorName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}