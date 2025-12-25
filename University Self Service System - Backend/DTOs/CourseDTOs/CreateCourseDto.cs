using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class CreateCourseDto
    {
        [Required, MaxLength(20)]
        public string Code { get; set; }        // e.g. "CSCI313"
        
        [Required, MaxLength(200)]
        public string Title { get; set; }
        
        [Required, Range(1, 6, ErrorMessage = "Credit hours must be between 1 and 6")]
        public int CreditHours { get; set; }

        // optional: assign a professor at creation
        public int? ProfessorId { get; set; }
        
        [Required, DataType(DataType.Date)]
        public DateTime StartDate { get; set; }
        
        [Required, DataType(DataType.Date)]
        public DateTime EndDate { get; set; }
        
        [Required, Range(1, 1000, ErrorMessage = "Capacity must be between 1 and 1000")]
        public int Capacity { get; set; }
    }
}

