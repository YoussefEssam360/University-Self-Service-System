using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class CreateProfessorDto
    {
        [Required, MinLength(3), MaxLength(50)]
        public required string Username { get; set; }

        [Required, MinLength(2), MaxLength(100)]
        public required string FullName { get; set; }

        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required, MinLength(6)]
        public required string Password { get; set; }

        [Required, Phone, MaxLength(50)]
        public required string PhoneNumber { get; set; }

        [Required, MaxLength(100)]
        public required string Department { get; set; }
    }
}
