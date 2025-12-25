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

        [Required, MinLength(8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$",
            ErrorMessage = "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)")]
        public required string Password { get; set; }

        [Required]
        public required string Role { get; set; }

        // Shared for Student/Professor
        [Phone]
        public string? PhoneNumber { get; set; }

        // Student fields (required when Role == Student)
        public string? Major { get; set; }
        
        // Validate date of birth: must be in the past and student must be at least 16 years old
        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        // Professor field (required when Role == Professor)
        public string? Department { get; set; }
    }
}