namespace University_Self_Service_System___Backend.Entities
{
    public class User
    {
        public int Id { get; set; }                 // primary key

        public string Username { get; set; }        // login name
        public string Email { get; set; }

        // later integrate proper hashing / Identity
        public string PasswordHash { get; set; }

        // "Student", "Professor", "Admin", etc.
        public string Role { get; set; }

        // optional one-to-one navigation to profile entities
        public Student StudentProfile { get; set; }
        public Professor ProfessorProfile { get; set; }
    }
}
