using AutoMapper;
using University_Self_Service_System___Backend.Data;
using University_Self_Service_System___Backend.Services.AuthServices;

namespace University_Self_Service_System___Backend.Services.ProfManagement
{
    public partial class profManagementService : IProfManagementService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public profManagementService(AppDbContext dbContext, IMapper mapper, IAuthService authService)
        {
            _context = dbContext;
            _mapper = mapper;
            _authService = authService;
        }
    }
}
