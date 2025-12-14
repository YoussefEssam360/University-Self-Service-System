using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices
    {
        public async Task<RupdateCourse> updateCourse(updateCourseDto courseDto)
        {
            if (courseDto == null)
            {
                Console.WriteLine("updateCourse: null DTO");
                return new RupdateCourse { done = false };
            }

            // Determine lookup key: prefer OriginalCode when editing the code itself
            var lookupKey = !string.IsNullOrWhiteSpace(courseDto.OriginalCode)
                ? courseDto.OriginalCode.Trim()
                : courseDto.Code?.Trim();

            if (string.IsNullOrWhiteSpace(lookupKey))
            {
                Console.WriteLine("updateCourse: missing lookup key (OriginalCode or Code)");
                return new RupdateCourse { done = false };
            }

            Console.WriteLine($"updateCourse: lookupKey='{lookupKey}', incoming Code='{courseDto.Code}', Title='{courseDto.Title}', CreditHours={courseDto.CreditHours}");

            // Try exact then case-insensitive matches (defensive)
            var courseEntity = await _context.Courses
                .FirstOrDefaultAsync(c => c.Code == lookupKey);

            if (courseEntity == null)
            {
                var keyLower = lookupKey.ToLowerInvariant();
                courseEntity = await _context.Courses
                    .FirstOrDefaultAsync(c => c.Code != null && c.Code.ToLower() == keyLower);
            }

            if (courseEntity == null)
            {
                Console.WriteLine($"updateCourse: no course found for lookupKey='{lookupKey}'");
                return new RupdateCourse { done = false };
            }

            // If the code is being changed, ensure the new code doesn't collide with another course
            var newCode = courseDto.Code?.Trim();
            if (!string.IsNullOrWhiteSpace(newCode) && !string.Equals(courseEntity.Code?.Trim(), newCode, StringComparison.OrdinalIgnoreCase))
            {
                var newCodeLower = newCode.ToLowerInvariant();
                var duplicate = await _context.Courses
                    .AnyAsync(c => c.Code != null && c.Code.ToLower() == newCodeLower && c.Id != courseEntity.Id);

                if (duplicate)
                {
                    Console.WriteLine($"updateCourse: target Code '{newCode}' already exists on a different course");
                    return new RupdateCourse { done = false };
                }

                courseEntity.Code = newCode;
            }

            // Update other fields
            courseEntity.Title = courseDto.Title;
            courseEntity.CreditHours = courseDto.CreditHours;

            await _context.SaveChangesAsync();

            Console.WriteLine($"updateCourse: updated course Id={courseEntity.Id}, Code='{courseEntity.Code}'");
            return new RupdateCourse { done = true };
        }
    }
}
