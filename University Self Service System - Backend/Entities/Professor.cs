namespace University_Self_Service_System___Backend.Entities
{
    public class Professor
    {
        public int Id { get; set; }                 // primary key
        public string Name { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }

        // navigation: one professor can teach many courses
        public ICollection<Course> Courses { get; set; }
            = new List<Course>();
    }
}
