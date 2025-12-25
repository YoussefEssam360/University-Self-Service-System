using AutoMapper;
using System.Linq;
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

        private (bool isValid, string normalizedPhone, string errorMessage) ValidateAndNormalizePhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
                return (false, string.Empty, "Phone number is required.");

            var phone = phoneNumber.Trim();

            // Remove +2 prefix if present
            if (phone.StartsWith("+2"))
            {
                phone = phone.Substring(2);
            }

            // Remove any spaces, dashes, or parentheses
            phone = phone.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");

            // Validate: must be exactly 11 digits and start with 01
            if (phone.Length != 11)
                return (false, string.Empty, "Phone number must be 11 digits.");

            if (!phone.StartsWith("01"))
                return (false, string.Empty, "Phone number must start with 01.");

            if (!phone.All(char.IsDigit))
                return (false, string.Empty, "Phone number must contain only digits.");

            return (true, phone, string.Empty);
        }
    }
}