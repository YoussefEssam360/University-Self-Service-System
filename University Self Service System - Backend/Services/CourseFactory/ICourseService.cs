using University_Self_Service_System___Backend.DTOs.CourseDTOs;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public interface ICourseService
    {
        Task<RCreatedCourseDto> CreateCourse(CreateCourseDto dto);
    }
}
