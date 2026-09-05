using System;
using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.StudentDTOs
{
    public class StudentUpdateDto
    {
        [Required]
        [StringLength(200, MinimumLength = 2)]
        public string? FullName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [Phone]
        [StringLength(50)]
        public string? PhoneNumber { get; set; }

        [Required]
        public DateTime? DateOfBirth { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string? Major { get; set; }
    }
}
