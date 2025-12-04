using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public partial class profManagementService
    {
        public async Task<RDeleteProfessorDto> DeleteProfessor(DeleteProfessorDto dto)
        {
            // 1. Find professor by ID
            var professor = await _context.Professors
                .FirstOrDefaultAsync(p => p.Id == dto.Id);

            if (professor == null)
            {
                return new RDeleteProfessorDto { ProfessorNotFound = true };
            }

            // 2. Remove professor (courses will have ProfessorId set to NULL automatically)
            _context.Professors.Remove(professor);
            await _context.SaveChangesAsync();

            return new RDeleteProfessorDto { Success = true };
        }
    }
}