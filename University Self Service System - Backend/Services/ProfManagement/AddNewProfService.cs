using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.AuthDTOs;
using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public partial class profManagementService
    {
        public async Task<RCreatedProfessorDto> CreateProfessor(CreateProfessorDto dto)
        {
            var registration = await _authService.RegisterAsync(new RegisterDto
            {
                Username = dto.Username.Trim(),
                FullName = dto.FullName.Trim(),
                Email = dto.Email.Trim(),
                Password = dto.Password,
                Role = "Professor",
                PhoneNumber = dto.PhoneNumber.Trim(),
                Department = dto.Department.Trim()
            });

            if (!registration.Success)
            {
                var message = registration.Errors?.FirstOrDefault() ?? "Professor account could not be created.";
                return new RCreatedProfessorDto
                {
                    EmailIsDuplicate = message.Contains("email", StringComparison.OrdinalIgnoreCase),
                    Message = message
                };
            }

            var professor = await _context.Professors
                .Include(item => item.User)
                .SingleAsync(item => item.User.Username == dto.Username.Trim());

            return new RCreatedProfessorDto
            {
                Id = professor.Id,
                Username = professor.User.Username,
                FullName = professor.FullName,
                Email = professor.Email,
                PhoneNumber = professor.PhoneNumber,
                Department = professor.Department,
                Success = true,
                Message = "Professor account created."
            };
        }
    }
}
