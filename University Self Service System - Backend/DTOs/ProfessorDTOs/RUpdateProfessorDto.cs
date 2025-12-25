namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class RUpdateProfessorDto
    {
        public bool Success { get; set; } = false;
        public bool ProfessorNotFound { get; set; } = false;
        public bool EmailIsDuplicate { get; set; } = false;
        public string? ErrorMessage { get; set; }
    }
}