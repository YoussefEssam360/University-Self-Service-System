using System.Collections.Generic;

namespace University_Self_Service_System___Backend.DTOs.StudentDTOs
{
    
    public class OperationResult<T>
    {
        public bool Success { get; set; } = true;
        public string? Message { get; set; }
        public T? Data { get; set; }
        public IEnumerable<string> Errors { get; set; } = System.Array.Empty<string>();
    }
}