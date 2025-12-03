using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.StudentDTOs
{
    
    public class RegisterCourseDto
    {
        [Required]
        public int CourseId { get; set; }

       
        public string? Notes { get; set; }
    }
}