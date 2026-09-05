using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices
    {
        public async Task<RCreatedCourseDto> CreateCourse(CreateCourseDto dto)
        {
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
                return new RCreatedCourseDto { Message = validationMessage };
            }

            var normalizedCode = code.ToLower();
            if (await _context.Courses.AnyAsync(course => course.Code.ToLower() == normalizedCode))
            {
                return new RCreatedCourseDto
                {
                    CourseCodeIsDuplicate = true,
                    Message = $"A course with code '{code}' already exists."
                };
            }

            Professor? professor = null;
            if (dto.ProfessorId.HasValue)
            {
                professor = await _context.Professors.FindAsync(dto.ProfessorId.Value);
                if (professor == null)
                {
                    return new RCreatedCourseDto
                    {
                        ProfessorIdNotFound = true,
                        Message = "The selected professor no longer exists."
                    };
                }
            }

            var course = new Course
            {
                Code = code,
                Title = title,
                CreditHours = dto.CreditHours,
                ProfessorId = professor?.Id,
                InstructorName = professor == null ? null : professor.FullName ?? professor.Name,
                Capacity = dto.Capacity,
                StartDate = dto.StartDate.Date,
                EndDate = dto.EndDate.Date
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return new RCreatedCourseDto
            {
                Id = course.Id,
                Success = true,
                Message = "Course created successfully."
            };
        }

        private static string? ValidateCourse(
            string code,
            string title,
            int creditHours,
            int capacity,
            DateTime startDate,
            DateTime endDate)
        {
            if (string.IsNullOrWhiteSpace(code)) return "Course code is required.";
            if (string.IsNullOrWhiteSpace(title)) return "Course title is required.";
            if (creditHours is < 1 or > 12) return "Credit hours must be between 1 and 12.";
            if (capacity < 1) return "Capacity must be at least 1.";
            if (startDate == default || endDate == default) return "Start and end dates are required.";
            if (endDate.Date < startDate.Date) return "End date must be on or after the start date.";
            return null;
        }
    }
}
