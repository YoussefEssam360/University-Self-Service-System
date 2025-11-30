using AutoMapper;
using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.Data;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices 
    {





        public async Task<RdeleteCourseDto> deleteCourse(deleteCourseDto courseDto)
        {
            // Extract the string Code from the DTO first.
            string courseCode = courseDto.Code;

            // FIX: Use Where and FirstOrDefaultAsync to search by the string Code.
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Code == courseCode); // Search by the string Code

            if (course == null)
            {
                return new RdeleteCourseDto { CourseNotFound = true };
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return new RdeleteCourseDto { done = true };
        }







    }
}
