using System.ComponentModel.DataAnnotations;

namespace University_Self_Service_System___Backend.Entities
{
    public class Professor
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Name { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;

        [MaxLength(50)]
        public string PhoneNumber { get; set; } = null!;

        public string Department { get; set; } = null!;

        public ICollection<Course> Courses { get; set; } = new List<Course>();
    }
}
