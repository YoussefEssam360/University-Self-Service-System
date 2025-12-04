namespace University_Self_Service_System___Backend.DTOs.CourseDTOs
{
    public class updateCourseDto
    {
        // New: OriginalCode used to find the existing record when editing the code
        public string OriginalCode { get; set; }

        public string Code { get; set; }            
        public string Title { get; set; }
        public int CreditHours { get; set; }
    }
}
