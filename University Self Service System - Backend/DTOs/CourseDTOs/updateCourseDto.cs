using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class updateCourseDto
    {
        [Required]
        public string OriginalCode { get; set; } = string.Empty;

        [Required, MaxLength(30)]
        public string Code { get; set; } = string.Empty;

        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Range(1, 12)]
        public int CreditHours { get; set; }

        public int? ProfessorId { get; set; }

        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
