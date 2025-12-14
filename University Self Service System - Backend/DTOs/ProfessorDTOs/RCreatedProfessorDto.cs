namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class RCreatedProfessorDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }

        // Status flags
        public bool Success { get; set; } = false;
        public bool EmailIsDuplicate { get; set; } = false;
    }
}