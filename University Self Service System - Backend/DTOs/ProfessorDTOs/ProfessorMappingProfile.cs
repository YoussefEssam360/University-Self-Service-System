using AutoMapper;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.DTOs.ProfessorDTOs
{
    public class ProfessorMappingProfile : Profile
    {
        public ProfessorMappingProfile()
        {
            // DTO ? Entity (for creating a professor)
            CreateMap<CreateProfessorDto, Professor>();

            // Entity ? Response DTO (for creation response)
            CreateMap<Professor, RCreatedProfessorDto>();

            // DTO ? Entity (for updating a professor)
            CreateMap<UpdateProfessorDto, Professor>();
        }
    }
}