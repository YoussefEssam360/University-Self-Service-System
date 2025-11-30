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

            // 1. Check for Duplicate Course Code (New Simple Check)
            var courseExists = await _context.Courses
                .AnyAsync(c => c.Code == dto.Code);

            if (courseExists)
            {
                // If duplicate found, return a DTO with only the status flag set
                // We won't save anything to the DB in this case.
                return new RCreatedCourseDto { CourseCodeIsDuplicate = true };
            }

            // 2. Validate ProfessorId if provided (Existing Logic)
            if (dto.ProfessorId.HasValue && dto.ProfessorId.Value != 0)
            {
                var profExists = await _context.Professors
                    .AnyAsync(p => p.Id == dto.ProfessorId.Value);

                if (!profExists)
                {
                    professorWasNotFound = true;
                    dto.ProfessorId = null;
                }
            }

            // 3. Forward Map: DTO -> Entity.
            var courseEntity = _mapper.Map<Course>(dto);

            // 4. Save to Database
            _context.Courses.Add(courseEntity);
            await _context.SaveChangesAsync();
            // Note: Since we checked for duplicates, saveChangesAsync should not fail here,
            // even if you still have the unique index on the DB.

            // 5. Reverse Map: Entity -> Result DTO
            var result = _mapper.Map<RCreatedCourseDto>(courseEntity);

            // 6. Set the ProfessorIdNotFound flag in the result DTO
            if (professorWasNotFound)
            {
                result.ProfessorIdNotFound = true;
            }

            return result;
        }
    }
}