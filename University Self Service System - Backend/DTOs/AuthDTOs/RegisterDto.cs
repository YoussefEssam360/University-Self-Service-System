using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.AuthDTOs
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public required string Username { get; set; }

        [Required]
        [EmailAddress]                     
        public required string Email { get; set; }

        [Required]
        [MinLength(6)]                      
        public required string Password { get; set; }

        [Required]
        public required string Role { get; set; }    // will further validate in service

        // optional for Student, required/used for Professor signup
        public string? Department { get; set; }
    }
}