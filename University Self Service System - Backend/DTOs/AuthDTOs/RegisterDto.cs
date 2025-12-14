using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.AuthDTOs
{
    public class RegisterDto
    {
        [Required, MinLength(3), MaxLength(50)]
        public required string Username { get; set; }

        [Required, MinLength(2), MaxLength(100)]
        public required string FullName { get; set; }

        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required, MinLength(6)]
        public required string Password { get; set; }

        [Required]
        public required string Role { get; set; }

        // Shared for Student/Professor
        [Phone]
        public string? PhoneNumber { get; set; }

        // Student fields (required when Role == Student)
        public string? Major { get; set; }
        public DateTime? DateOfBirth { get; set; }

        // Professor field (required when Role == Professor)
        public string? Department { get; set; }
    }
}