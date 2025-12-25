namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class UpdateProfessorDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }
        public string? PhoneNumber { get; set; }
    }
}