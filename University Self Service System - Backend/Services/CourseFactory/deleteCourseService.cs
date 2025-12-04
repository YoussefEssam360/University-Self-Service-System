using AutoMapper;
using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.Data;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices
    {
        // Match the ICourseService signature: accept the course code string
        public async Task<RdeleteCourseDto> deleteCourse(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return new RdeleteCourseDto { CourseNotFound = true };
            }

            var codeNormalized = code.Trim().ToLowerInvariant();

            // Case-insensitive lookup to avoid misses due to casing/collation
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Code.ToLower() == codeNormalized);

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
