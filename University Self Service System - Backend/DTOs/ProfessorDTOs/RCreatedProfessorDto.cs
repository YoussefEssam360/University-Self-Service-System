namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class RCreatedProfessorDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;

        // Status flags
        public bool Success { get; set; } = false;
        public bool EmailIsDuplicate { get; set; } = false;
        public string? Message { get; set; }
    }
}
