using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public partial class profManagementService
    {
        public async Task<RDeleteProfessorDto> DeleteProfessor(DeleteProfessorDto dto)
        {
            var professor = await _context.Professors
                .Include(item => item.Courses)
                .Include(item => item.User)
                .FirstOrDefaultAsync(p => p.Id == dto.Id);

            if (professor == null)
            {
                return new RDeleteProfessorDto { ProfessorNotFound = true, Message = "Professor was not found." };
            }

            if (professor.Courses.Count > 0)
            {
                return new RDeleteProfessorDto
                {
                    HasAssignedCourses = true,
                    CourseCount = professor.Courses.Count,
                    Message = "Reassign this professor's courses before deleting the account."
                };
            }

            _context.Users.Remove(professor.User);
            await _context.SaveChangesAsync();

            return new RDeleteProfessorDto { Success = true, Message = "Professor account deleted." };
        }
    }
}
