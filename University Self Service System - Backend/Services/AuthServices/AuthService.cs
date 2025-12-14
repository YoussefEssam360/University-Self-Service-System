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
            // normalize + validate role
            var allowedRoles = new[] { "Admin", "Student", "Professor" };

            var normalizedRole = (dto.Role ?? "").Trim();

            // make first letter capital, rest lower (admin → Admin)
            normalizedRole = char.ToUpper(normalizedRole[0]) + normalizedRole[1..].ToLower();

            if (!allowedRoles.Contains(normalizedRole))
            {
                return new AuthResultDto
                {
                    Success = false,
                    Errors = new[] { "Role must be one of: Admin, Student, Professor." }
                };
            }

            // check if username or email already exists
            bool userExists = await _context.Users
                .AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email);

            if (userExists)
            {
                return new AuthResultDto
                {
                    Success = false,
                    Errors = new[] { "Username or email already in use." }
                };
            }

            var user = new User
            {
                Username = dto.Username.Trim(),
                Email = dto.Email.Trim(),
                Role = normalizedRole,
                PasswordHash = HashPassword(dto.Password)
            };

            // Save the user first so we have the generated Id
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create profile row for Student or Professor (Admin accounts are created manually)
            if (normalizedRole == "Student")
            {
                var student = new Student
                {
                    UserId = user.Id,
                    Name = user.Username,
                    Email = user.Email
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
                    Email = user.Email,
                    Department = string.IsNullOrWhiteSpace(dto.Department) ? "Unknown" : dto.Department.Trim()
                };

                _context.Professors.Add(professor);
                await _context.SaveChangesAsync();
            }

            var token = GenerateJwtToken(user);

            return new AuthResultDto
            {
                Success = true,
                Token = token,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<AuthResultDto> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
            {
                return new AuthResultDto
                {
                    Success = false,
                    Errors = new[] { "Invalid username or password." }
                };
            }

            var token = GenerateJwtToken(user);

            return new AuthResultDto
            {
                Success = true,
                Token = token,
                Username = user.Username,
                Role = user.Role
            };
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

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var keyValue = jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
            var issuer = jwtSettings["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is not configured.");
            var audience = jwtSettings["Audience"] ?? throw new InvalidOperationException("Jwt:Audience is not configured.");
            var durationMinutesText = jwtSettings["DurationMinutes"] ?? "60";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyValue));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

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
                expires: DateTime.UtcNow.AddMinutes(double.Parse(durationMinutesText)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}