using AutoMapper;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Mappings
{
    public class CourseMappingProfile : Profile
    {
        public CourseMappingProfile()
        {
            // DTO → Entity (for creating a course)
            CreateMap<CreateCourseDto, Course>().ForMember(dest => dest.ProfessorId, opt => opt.Ignore()); ;

            // If you later have other DTOs, add them here:
            // CreateMap<UpdateCourseDto, Course>();
            // CreateMap<Course, CourseDetailsDto>();

            CreateMap<Course, RCreatedCourseDto>();


            // ------------------ Delete Course Mappings ------------------
            //Dto --> Entity for input
            CreateMap<deleteCourseDto, Course>();
            //Entity --> RDto for output
            CreateMap<Course, RdeleteCourseDto>();
            // -------------------------------------------------------------

            // ------------------ Edit Course Mappings ------------------
            //Dto --> Entity for input
            CreateMap<updateCourseDto, Course>();
            //Entity --> RDto for output
            CreateMap<Course, RupdateCourse>();
            // -------------------------------------------------------------

            // ------------------ View Course Mappings ------------------
            CreateMap<Course, RviewCourseDto>();

        }
    }
}
