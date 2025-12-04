using AutoMapper;
using University_Self_Service_System___Backend.Data;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public partial class profManagementService : IProfManagementService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public profManagementService(AppDbContext dbContext, IMapper mapper)
        {
            _context = dbContext;
            _mapper = mapper;
        }
    }
}