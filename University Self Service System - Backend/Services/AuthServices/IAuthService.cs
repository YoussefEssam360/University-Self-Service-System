using University_Self_Service_System___Backend.DTOs.AuthDTOs;

namespace University_Self_Service_System___Backend.Services.AuthServices
{
    public interface IAuthService
    {
        Task<AuthResultDto> RegisterAsync(RegisterDto dto);
        Task<AuthResultDto> LoginAsync(LoginDto dto);
    }
}
