using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.StudentDTOs
{
    
    public class CancelRegistrationDto
    {
       
        public int? EnrollmentId { get; set; }

        public int? CourseId { get; set; }
    }
}