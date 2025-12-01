using AutoMapper;
using University_Self_Service_System___Backend.Data;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices : ICourseService
    {

        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public courseServices(AppDbContext dbContext, IMapper mapper)
        {
            _context = dbContext;
            _mapper = mapper;
        }
    }
}
