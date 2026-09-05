using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices
    {
        public async Task<RupdateCourse> updateCourse(updateCourseDto dto)
        {
            var lookupCode = dto.OriginalCode.Trim();
            var code = dto.Code.Trim();
            var title = dto.Title.Trim();

            var validationMessage = ValidateCourse(
                code,
                title,
                dto.CreditHours,
                dto.Capacity,
                dto.StartDate,
                dto.EndDate);

            if (validationMessage != null)
            {
                return new RupdateCourse { Message = validationMessage };
            }

            var normalizedLookupCode = lookupCode.ToLower();
            var course = await _context.Courses
                .FirstOrDefaultAsync(item => item.Code.ToLower() == normalizedLookupCode);

            if (course == null)
            {
                return new RupdateCourse
                {
                    CourseNotFound = true,
                    Message = "Course not found. Refresh the page and try again."
                };
            }

            var normalizedCode = code.ToLower();
            var duplicateCode = await _context.Courses.AnyAsync(item =>
                item.Id != course.Id && item.Code.ToLower() == normalizedCode);

            if (duplicateCode)
            {
                return new RupdateCourse
                {
                    CourseCodeIsDuplicate = true,
                    Message = $"A course with code '{code}' already exists."
                };
            }

            var enrolledCount = await _context.Enrollments.CountAsync(item => item.CourseId == course.Id);
            if (dto.Capacity < enrolledCount)
            {
                return new RupdateCourse
                {
                    Message = $"Capacity cannot be lower than the {enrolledCount} currently enrolled students."
                };
            }

            Professor? professor = null;
            if (dto.ProfessorId.HasValue)
            {
                professor = await _context.Professors.FindAsync(dto.ProfessorId.Value);
                if (professor == null)
                {
                    return new RupdateCourse
                    {
                        ProfessorIdNotFound = true,
                        Message = "The selected professor no longer exists."
                    };
                }
            }

            course.Code = code;
            course.Title = title;
            course.CreditHours = dto.CreditHours;
            course.ProfessorId = professor?.Id;
            course.InstructorName = professor == null ? null : professor.FullName ?? professor.Name;
            course.Capacity = dto.Capacity;
            course.StartDate = dto.StartDate.Date;
            course.EndDate = dto.EndDate.Date;

            await _context.SaveChangesAsync();

            return new RupdateCourse
            {
                done = true,
                Message = "Course updated successfully."
            };
        }
    }
}
