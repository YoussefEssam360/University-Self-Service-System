namespace University_Self_Service_System___Backend.Entities
{
    public class Professor
    {
        public int Id { get; set; }                 // primary key

        // Link to the User account (one-to-one)
        public int UserId { get; set; }
        public User User { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }

        // navigation: one professor → many courses
        public ICollection<Course> Courses { get; set; } = new List<Course>();
    }
}
