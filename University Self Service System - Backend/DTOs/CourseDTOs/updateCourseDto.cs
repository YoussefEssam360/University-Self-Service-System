using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class updateCourseDto
    {
        // New: OriginalCode used to find the existing record when editing the code
        public string OriginalCode { get; set; }

        [MaxLength(20)]
        public string Code { get; set; }            
        
        [MaxLength(200)]
        public string Title { get; set; }
        
        [Range(1, 6, ErrorMessage = "Credit hours must be between 1 and 6")]
        public int CreditHours { get; set; }
    }
}
