using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public partial class profManagementService
    {
        public async Task<RCreatedProfessorDto> CreateProfessor(CreateProfessorDto dto)
        {
            // 1. Check for Duplicate Email
            var emailExists = await _context.Professors
                .AnyAsync(p => p.Email == dto.Email);

            if (emailExists)
            {
                return new RCreatedProfessorDto { EmailIsDuplicate = true };
            }

            // 2. Map DTO to Entity
            var professorEntity = _mapper.Map<Professor>(dto);

            // 3. Save to Database
            _context.Professors.Add(professorEntity);
            await _context.SaveChangesAsync();

            // 4. Map Entity to Response DTO
            var result = _mapper.Map<RCreatedProfessorDto>(professorEntity);
            result.Success = true;

            return result;
        }
    }
}