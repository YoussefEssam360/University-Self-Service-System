using System;

namespace University_Self_Service_System___Backend.DTOs.StudentDTOs
{
    public class StudentProfileDto
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Major { get; set; }
    }
}