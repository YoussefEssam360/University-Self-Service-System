using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices
    {



        public async Task<RupdateCourse> updateCourse(updateCourseDto courseDto)
        {
            var courseEntity = _mapper.Map<Course>(courseDto);
            await _context.SaveChangesAsync();

            return new RupdateCourse() { done = true};

        }





    }
}
