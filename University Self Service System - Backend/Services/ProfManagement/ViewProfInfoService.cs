using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public partial class profManagementService
    {
        public async Task<List<RViewProfessorDto>> ViewProfessors()
        {
            // 1. Project directly from the database query (IQueryable)
            var professorDtos = await _context.Professors
                .Select(p => new RViewProfessorDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Email = p.Email,
                    Department = p.Department,
                    CourseCount = p.Courses.Count
                })
                // 2. Execute the query and materialize the List<RViewProfessorDto>
                .ToListAsync();

            return professorDtos;
        }

        public async Task<RViewProfessorDto> ViewProfessorById(int id)
        {
            var professorDto = await _context.Professors
                .Where(p => p.Id == id)
                .Select(p => new RViewProfessorDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Email = p.Email,
                    Department = p.Department,
                    CourseCount = p.Courses.Count
                })
                .FirstOrDefaultAsync();

            if (professorDto == null)
            {
                return new RViewProfessorDto { ProfessorNotFound = true };
            }

            return professorDto;
        }
    }
}