// Ensure RCreatedCourseDto includes this property:
// public bool CourseCodeIsDuplicate { get; set; } = false;

// File: University_Self_Service_System___Backend/Services/CourseFactory/CreateCourseService.cs

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.Data;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices 
    {
        public async Task<RCreatedCourseDto> CreateCourse(CreateCourseDto dto)
        {
            bool professorWasNotFound = false;
            string? instructorName = null;

            // 1. Check for Duplicate Course Code
            var courseExists = await _context.Courses.AnyAsync(c => c.Code == dto.Code);
            if (courseExists)
            {
                return new RCreatedCourseDto { CourseCodeIsDuplicate = true };
            }

            // 2. Validate ProfessorId if provided
            if (dto.ProfessorId.HasValue && dto.ProfessorId.Value != 0)
            {
                var professor = await _context.Professors
                    .FirstOrDefaultAsync(p => p.Id == dto.ProfessorId.Value);

                if (professor == null)
                {
                    professorWasNotFound = true;
                    dto.ProfessorId = null;
                }
                else
                {
                    // Derive InstructorName from professor
                    instructorName = professor.FullName;
                }
            }

            // 3. Map DTO -> Entity
            var courseEntity = _mapper.Map<Course>(dto);

            // 4. Set InstructorName (null if no professor assigned)
            courseEntity.InstructorName = instructorName;

            // 5. Save to Database
            _context.Courses.Add(courseEntity);
            await _context.SaveChangesAsync();

            // 6. Map Entity -> Result DTO
            var result = _mapper.Map<RCreatedCourseDto>(courseEntity);

            if (professorWasNotFound)
            {
                result.ProfessorIdNotFound = true;
            }

            return result;
        }
    }
}