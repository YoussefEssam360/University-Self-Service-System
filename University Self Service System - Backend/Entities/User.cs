namespace University_Self_Service_System___Backend.Entities
{
    public class User
    {
        public int Id { get; set; }                 // primary key

        public string Username { get; set; } = null!;
        // Added FullName because other code references User.FullName
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;

        // later integrate proper hashing / Identity
        public string PasswordHash { get; set; } = null!;

        // "Student", "Professor", "Admin", etc.
        public string Role { get; set; } = null!;

        // optional one-to-one navigation to profile entities
        public Student? StudentProfile { get; set; }
        public Professor? ProfessorProfile { get; set; }
    }
}
