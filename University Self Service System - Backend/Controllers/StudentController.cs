using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using University_Self_Service_System___Backend.DTOs.StudentDTOs;
using University_Self_Service_System___Backend.Data;
using University_Self_Service_System___Backend.Services.StudentServices;

namespace University_Self_Service_System___Backend.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Student,Admin")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly ILogger<StudentController> _logger;
        private readonly AppDbContext _db;

        public StudentController(IStudentService studentService, ILogger<StudentController> logger, AppDbContext db)
        {
            _studentService = studentService;
            _logger = logger;
            _db = db;
        }

        private async Task<bool> CanAccessStudentAsync(int studentId, CancellationToken cancellationToken)
        {
            if (User.IsInRole("Admin")) return true;

            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");

            return int.TryParse(userIdValue, out var userId)
                && await _db.Students.AnyAsync(
                    student => student.Id == studentId && student.UserId == userId,
                    cancellationToken);
        }

        private async Task<int?> GetCurrentStudentIdAsync(CancellationToken cancellationToken)
        {
            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");

            if (!int.TryParse(userIdValue, out var userId)) return null;

            return await _db.Students
                .Where(student => student.UserId == userId)
                .Select(student => (int?)student.Id)
                .FirstOrDefaultAsync(cancellationToken);
        }

        [HttpGet("me/profile")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(typeof(OperationResult<StudentProfileDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetMyProfile(CancellationToken cancellationToken = default)
        {
            var studentId = await GetCurrentStudentIdAsync(cancellationToken);
            if (!studentId.HasValue)
            {
                return NotFound(new OperationResult<StudentProfileDto>
                {
                    Success = false,
                    Message = "A student profile is not linked to this account."
                });
            }

            var result = await _studentService.GetProfileAsync(studentId.Value, cancellationToken);
            return result.Success ? Ok(result) : NotFound(result);
        }

        [HttpPut("me/profile")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(typeof(OperationResult<StudentProfileDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateMyProfile(
            [FromBody] StudentUpdateDto updateDto,
            CancellationToken cancellationToken = default)
        {
            var studentId = await GetCurrentStudentIdAsync(cancellationToken);
            if (!studentId.HasValue)
            {
                return NotFound(new OperationResult<StudentProfileDto>
                {
                    Success = false,
                    Message = "A student profile is not linked to this account."
                });
            }

            var result = await _studentService.UpdateProfileAsync(studentId.Value, updateDto, cancellationToken);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("me/enrollments")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(typeof(OperationResult<System.Collections.Generic.IEnumerable<EnrolledCourseDto>>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetMyEnrolledCourses(CancellationToken cancellationToken = default)
        {
            var studentId = await GetCurrentStudentIdAsync(cancellationToken);
            if (!studentId.HasValue)
            {
                return NotFound(new OperationResult<System.Collections.Generic.IEnumerable<EnrolledCourseDto>>
                {
                    Success = false,
                    Message = "A student profile is not linked to this account."
                });
            }

            var result = await _studentService.GetEnrolledCoursesAsync(studentId.Value, cancellationToken);
            return Ok(result);
        }

        [HttpPost("me/enrollments")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(typeof(OperationResult<EnrolledCourseDto>), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> RegisterMyCourse(
            [FromBody] RegisterCourseDto dto,
            CancellationToken cancellationToken = default)
        {
            var studentId = await GetCurrentStudentIdAsync(cancellationToken);
            if (!studentId.HasValue)
            {
                return NotFound(new OperationResult<EnrolledCourseDto>
                {
                    Success = false,
                    Message = "A student profile is not linked to this account."
                });
            }

            var result = await _studentService.RegisterForCourseAsync(studentId.Value, dto, cancellationToken);
            if (!result.Success) return BadRequest(result);

            return Created($"/api/student/me/enrollments/{result.Data?.EnrollmentId}", result);
        }

        [HttpDelete("me/enrollments/{enrollmentId:int}")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> CancelMyRegistration(
            int enrollmentId,
            CancellationToken cancellationToken = default)
        {
            var studentId = await GetCurrentStudentIdAsync(cancellationToken);
            if (!studentId.HasValue)
            {
                return NotFound(new OperationResult<bool>
                {
                    Success = false,
                    Message = "A student profile is not linked to this account."
                });
            }

            var result = await _studentService.CancelRegistrationAsync(
                studentId.Value,
                new CancelRegistrationDto { EnrollmentId = enrollmentId },
                cancellationToken);

            return result.Success ? NoContent() : BadRequest(result);
        }

        
        [HttpGet("{studentId:int}/profile")]
        [ProducesResponseType(typeof(OperationResult<StudentProfileDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetProfile(int studentId, CancellationToken cancellationToken = default)
        {
            if (!await CanAccessStudentAsync(studentId, cancellationToken)) return Forbid();
            var res = await _studentService.GetProfileAsync(studentId, cancellationToken);
            if (!res.Success) return NotFound(res);
            return Ok(res);
        }

        
        [HttpPut("{studentId:int}/profile")]
        [ProducesResponseType(typeof(OperationResult<StudentProfileDto>), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateProfile(int studentId, [FromBody] StudentUpdateDto updateDto, CancellationToken cancellationToken = default)
        {
            if (!await CanAccessStudentAsync(studentId, cancellationToken)) return Forbid();
            var res = await _studentService.UpdateProfileAsync(studentId, updateDto, cancellationToken);
            if (!res.Success) return BadRequest(res);
            return Ok(res);
        }

        
        [HttpGet("{studentId:int}/enrollments")]
        [ProducesResponseType(typeof(OperationResult<System.Collections.Generic.IEnumerable<EnrolledCourseDto>>), 200)]
        public async Task<IActionResult> GetEnrolledCourses(int studentId, CancellationToken cancellationToken = default)
        {
            if (!await CanAccessStudentAsync(studentId, cancellationToken)) return Forbid();
            var res = await _studentService.GetEnrolledCoursesAsync(studentId, cancellationToken);
            return Ok(res);
        }

        
        [HttpPost("{studentId:int}/register")]
        [ProducesResponseType(typeof(OperationResult<EnrolledCourseDto>), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RegisterForCourse(int studentId, [FromBody] RegisterCourseDto dto, CancellationToken cancellationToken = default)
        {
            if (!await CanAccessStudentAsync(studentId, cancellationToken)) return Forbid();
            var res = await _studentService.RegisterForCourseAsync(studentId, dto, cancellationToken);
            if (!res.Success) return BadRequest(res);
            
            return Created($"/api/student/{studentId}/enrollments/{res.Data?.EnrollmentId}", res);
        }

       
        [HttpDelete("{studentId:int}/enrollments")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CancelRegistration(int studentId, [FromBody] CancelRegistrationDto dto, CancellationToken cancellationToken = default)
        {
            if (!await CanAccessStudentAsync(studentId, cancellationToken)) return Forbid();
            var res = await _studentService.CancelRegistrationAsync(studentId, dto, cancellationToken);
            if (!res.Success) return BadRequest(res);
            return NoContent();
        }
    }
}
