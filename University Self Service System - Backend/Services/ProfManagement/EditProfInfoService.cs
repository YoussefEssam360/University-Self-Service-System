using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public partial class profManagementService
    {
        public async Task<RUpdateProfessorDto> UpdateProfessor(UpdateProfessorDto dto)
        {
            var professor = await _context.Professors
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == dto.Id);

            if (professor == null)
            {
                return new RUpdateProfessorDto { ProfessorNotFound = true, Message = "Professor was not found." };
            }

            var fullName = dto.FullName.Trim();
            var email = dto.Email.Trim();
            var phone = dto.PhoneNumber.Trim();
            var department = dto.Department.Trim();

            var emailExists = await _context.Users.AnyAsync(user =>
                user.Email == email && user.Id != professor.UserId);
            if (emailExists)
            {
                return new RUpdateProfessorDto
                {
                    EmailIsDuplicate = true,
                    Message = "Email is already in use."
                };
            }

            var phoneExists = await _context.Professors.AnyAsync(item =>
                    item.PhoneNumber == phone && item.Id != dto.Id)
                || await _context.Students.AnyAsync(item => item.PhoneNumber == phone);
            if (phoneExists)
            {
                return new RUpdateProfessorDto { Message = "Phone number is already in use." };
            }

            professor.FullName = fullName;
            professor.Email = email;
            professor.PhoneNumber = phone;
            professor.Department = department;
            professor.User.FullName = fullName;
            professor.User.Email = email;

            await _context.SaveChangesAsync();

            return new RUpdateProfessorDto { Success = true, Message = "Professor updated." };
        }
    }
}
