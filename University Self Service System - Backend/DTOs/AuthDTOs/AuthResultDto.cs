namespace University_Self_Service_System___Backend.DTOs.AuthDTOs
{
    public class AuthResultDto
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public IEnumerable<string> Errors { get; set; }

        // So the frontend can easily check “is this user an Admin?”, add Role to the result:
        public string Username { get; set; }
        public string Role { get; set; }   
             
        // Token expiration timestamp (UTC)
        public DateTime? ExpiresAt { get; set; }    }
}
