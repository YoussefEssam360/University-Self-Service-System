using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public interface IProfManagementService
    {
        Task<RCreatedProfessorDto> CreateProfessor(CreateProfessorDto dto);
        Task<RUpdateProfessorDto> UpdateProfessor(UpdateProfessorDto dto);
        Task<List<RViewProfessorDto>> ViewProfessors();
        Task<RViewProfessorDto> ViewProfessorById(int id);
        Task<RDeleteProfessorDto> DeleteProfessor(DeleteProfessorDto dto);
    }
}
