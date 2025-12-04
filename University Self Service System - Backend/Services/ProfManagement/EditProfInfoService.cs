using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public partial class profManagementService
    {
        public async Task<RUpdateProfessorDto> UpdateProfessor(UpdateProfessorDto dto)
        {
            // 1. Find the professor by ID
            var professor = await _context.Professors
                .FirstOrDefaultAsync(p => p.Id == dto.Id);

            if (professor == null)
            {
                return new RUpdateProfessorDto { ProfessorNotFound = true };
            }

            // 2. Check if email is being changed to a duplicate
            if (professor.Email != dto.Email)
            {
                var emailExists = await _context.Professors
                    .AnyAsync(p => p.Email == dto.Email && p.Id != dto.Id);

                if (emailExists)
                {
                    return new RUpdateProfessorDto { EmailIsDuplicate = true };
                }
            }

            // 3. Update properties
            professor.Name = dto.Name;
            professor.Email = dto.Email;
            professor.Department = dto.Department;

            // 4. Save changes
            await _context.SaveChangesAsync();

            return new RUpdateProfessorDto { Success = true };
        }
    }
}