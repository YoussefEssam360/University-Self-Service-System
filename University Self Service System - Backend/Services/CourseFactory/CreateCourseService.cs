using AutoMapper;
using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.Data;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public class CreateCourseService : ICourseService
    {




        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CreateCourseService(AppDbContext dbContext, IMapper mapper)
        {
            _context = dbContext;
            _mapper = mapper;
        }

        public async Task<RCreatedCourseDto> CreateCourse(CreateCourseDto dto)
        {
            // 1. Forward Map: DTO -> Entity
            var courseEntity = _mapper.Map<Course>(dto);

            // 2. Persistence: Database assigns the new ID
            _context.Courses.Add(courseEntity);
            await _context.SaveChangesAsync();

            // 3. Reverse Map Fix: Now use the DTO you defined in the mapper profile
            // This line uses the rule: CreateMap<Course, RCreatedCourseDto>();
            var result = _mapper.Map<RCreatedCourseDto>(courseEntity);

            // The result DTO now contains the database-generated ID.
            return result;
        }


    }
}
