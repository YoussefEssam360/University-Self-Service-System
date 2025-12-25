using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.AuthDTOs;
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

            // 3. Validate and update phone number if provided
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
            {
                var (isValid, normalizedPhone, errorMsg) = ValidateAndNormalizePhoneNumber(dto.PhoneNumber);
                if (!isValid)
                {
                    return new RUpdateProfessorDto { Success = false, ErrorMessage = errorMsg };
                }

                // Check phone uniqueness across all students and professors
                var phoneExists = await _context.Students.AnyAsync(s => s.PhoneNumber == normalizedPhone) ||
                                  await _context.Professors.AnyAsync(p => p.PhoneNumber == normalizedPhone && p.Id != dto.Id);
                
                if (phoneExists)
                {
                    return new RUpdateProfessorDto { Success = false, ErrorMessage = "Phone number already in use." };
                }

                professor.PhoneNumber = normalizedPhone;
            }

            // 4. Update other properties
            professor.Name = dto.Name;
            professor.Email = dto.Email;
            professor.Department = dto.Department;

            // 5. Save changes
            await _context.SaveChangesAsync();
            return new RUpdateProfessorDto { Success = true };
        }
    }
}