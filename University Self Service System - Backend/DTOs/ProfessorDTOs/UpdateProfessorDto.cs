using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class UpdateProfessorDto
    {
        [Range(1, int.MaxValue)]
        public int Id { get; set; }

        [Required, MinLength(2), MaxLength(100)]
        public required string FullName { get; set; }

        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required, Phone, MaxLength(50)]
        public required string PhoneNumber { get; set; }

        [Required, MaxLength(100)]
        public required string Department { get; set; }
    }
}
