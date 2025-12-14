using System;
using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.StudentDTOs
{
    public class StudentUpdateDto
    {
        [StringLength(200)]
        public string? FullName { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        [StringLength(50)]
        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(100)]
        public string? Major { get; set; }
    }
}