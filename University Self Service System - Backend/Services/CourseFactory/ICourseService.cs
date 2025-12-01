using University_Self_Service_System___Backend.DTOs.CourseDTOs;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public interface ICourseService
    {

        Task<RCreatedCourseDto> CreateCourse(CreateCourseDto dto);
        Task<RdeleteCourseDto> deleteCourse(deleteCourseDto courseCode);
        Task<RupdateCourse> updateCourse(updateCourseDto courseDto);
        Task<List<RviewCourseDto>> viewCourses();

    }
}
