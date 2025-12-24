using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using University_Self_Service_System___Backend.Data;
using University_Self_Service_System___Backend.DTOs.AuthDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Services.AuthServices
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResultDto> RegisterAsync(RegisterDto dto)
        {
            var allowedRoles = new[] { "Admin", "Student", "Professor" };
            var roleInput = (dto.Role ?? string.Empty).Trim();
            var normalizedRole = roleInput.Length > 0
                ? char.ToUpper(roleInput[0]) + roleInput[1..].ToLower()
                : string.Empty;

            if (!allowedRoles.Contains(normalizedRole))
            {
                return new AuthResultDto { Success = false, Errors = new[] { "Role must be one of: Admin, Student, Professor." } };
            }

            // Role-based validation
            if (normalizedRole == "Student")
            {
                var missing = new List<string>();
                if (string.IsNullOrWhiteSpace(dto.PhoneNumber)) missing.Add("PhoneNumber");
                if (string.IsNullOrWhiteSpace(dto.Major)) missing.Add("Major");
                if (!dto.DateOfBirth.HasValue) missing.Add("DateOfBirth");
                if (missing.Count > 0)
                {
                    return new AuthResultDto { Success = false, Errors = new[] { $"Missing required student fields: {string.Join(", ", missing)}." } };
                }
            }
            else if (normalizedRole == "Professor")
            {
                if (string.IsNullOrWhiteSpace(dto.Department) || string.IsNullOrWhiteSpace(dto.PhoneNumber))
                {
                    return new AuthResultDto { Success = false, Errors = new[] { "Department and PhoneNumber are required for Professor." } };
                }
            }

            // Existing uniqueness checks
            var usernameLower = dto.Username.Trim().ToLower();
            var emailLower = dto.Email.Trim().ToLower();
            bool userExists = await _context.Users.AnyAsync(u => 
                u.Username.ToLower() == usernameLower || 
                u.Email.ToLower() == emailLower);
            if (userExists)
            {
                return new AuthResultDto { Success = false, Errors = new[] { "Username or email already in use." } };
            }

            // Phone uniqueness across profiles (Student + Professor)
            var phone = (dto.PhoneNumber ?? string.Empty).Trim();
            if (!string.IsNullOrEmpty(phone))
            {
                bool phoneExists =
                    await _context.Students.AnyAsync(s => s.PhoneNumber == phone) ||
                    await _context.Professors.AnyAsync(p => p.PhoneNumber == phone);

                if (phoneExists)
                {
                    return new AuthResultDto { Success = false, Errors = new[] { "Phone number already in use." } };
                }
            }

            var user = new User
            {
                Username = dto.Username.Trim(),
                FullName = dto.FullName.Trim(),
                Email = dto.Email.Trim(),
                Role = normalizedRole,
                PasswordHash = HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            if (normalizedRole == "Student")
            {
                var student = new Student
                {
                    UserId = user.Id,
                    Name = user.Username,
                    FullName = user.FullName,
                    Email = user.Email,
                    PhoneNumber = phone,
                    Major = dto.Major!.Trim(),
                    DateOfBirth = dto.DateOfBirth
                };

                _context.Students.Add(student);
                await _context.SaveChangesAsync();
            }
            else if (normalizedRole == "Professor")
            {
                var professor = new Professor
                {
                    UserId = user.Id,
                    Name = user.Username,
                    FullName = user.FullName,
                    Email = user.Email,
                    PhoneNumber = phone,
                    Department = dto.Department!.Trim()
                };

                _context.Professors.Add(professor);
                await _context.SaveChangesAsync();
            }

            var (token, expiresAt) = GenerateJwtToken(user);
            return new AuthResultDto 
            { 
                Success = true, 
                Token = token, 
                Username = user.Username, 
                Role = user.Role,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResultDto> LoginAsync(LoginDto dto)
        {
            var usernameLower = dto.Username.Trim().ToLower();
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == usernameLower);

            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
            {
                return new AuthResultDto
                {
                    Success = false,
                    Errors = new[] { "Invalid username or password." }
                };
            }

            var (token, expiresAt) = GenerateJwtToken(user);

            return new AuthResultDto
            {
                Success = true,
                Token = token,
                Username = user.Username,
                Role = user.Role,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResultDto> RefreshTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtSettings = _configuration.GetSection("Jwt");
                var keyValue = jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyValue));

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = false, // We validate expired tokens to refresh them
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = key,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
                
                if (validatedToken is not JwtSecurityToken jwtToken || 
                    !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return new AuthResultDto { Success = false, Errors = new[] { "Invalid token." } };
                }

                var userIdClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                {
                    return new AuthResultDto { Success = false, Errors = new[] { "Invalid token claims." } };
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return new AuthResultDto { Success = false, Errors = new[] { "User not found." } };
                }

                var (newToken, expiresAt) = GenerateJwtToken(user);
                return new AuthResultDto
                {
                    Success = true,
                    Token = newToken,
                    Username = user.Username,
                    Role = user.Role,
                    ExpiresAt = expiresAt
                };
            }
            catch (Exception ex)
            {
                return new AuthResultDto { Success = false, Errors = new[] { "Token refresh failed: " + ex.Message } };
            }
        }

        // ===== helpers =====

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == storedHash;
        }

        private (string token, DateTime expiresAt) GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var keyValue = jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
            var issuer = jwtSettings["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is not configured.");
            var audience = jwtSettings["Audience"] ?? throw new InvalidOperationException("Jwt:Audience is not configured.");
            var durationMinutesText = jwtSettings["DurationMinutes"] ?? "60";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyValue));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiresAt = DateTime.UtcNow.AddMinutes(double.Parse(durationMinutesText));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(ClaimTypes.Role, user.Role ?? "Student")
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: creds
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
        }
    }
}