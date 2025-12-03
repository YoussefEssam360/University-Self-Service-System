using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
using University_Self_Service_System___Backend.DTOs.StudentDTOs;
using University_Self_Service_System___Backend.Services.StudentServices;

namespace University_Self_Service_System___Backend.Controllers
{
    // API endpoints for Student functionality.
    // Place this file under the Controllers folder.
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly ILogger<StudentController> _logger;

        public StudentController(IStudentService studentService, ILogger<StudentController> logger)
        {
            _studentService = studentService;
            _logger = logger;
        }

        // GET api/student/{studentId}/profile
        [HttpGet("{studentId:int}/profile")]
        [ProducesResponseType(typeof(OperationResult<StudentProfileDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetProfile(int studentId, CancellationToken cancellationToken = default)
        {
            var res = await _studentService.GetProfileAsync(studentId, cancellationToken);
            if (!res.Success) return NotFound(res);
            return Ok(res);
        }

        // PUT api/student/{studentId}/profile
        [HttpPut("{studentId:int}/profile")]
        [ProducesResponseType(typeof(OperationResult<StudentProfileDto>), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateProfile(int studentId, [FromBody] StudentUpdateDto updateDto, CancellationToken cancellationToken = default)
        {
            var res = await _studentService.UpdateProfileAsync(studentId, updateDto, cancellationToken);
            if (!res.Success) return BadRequest(res);
            return Ok(res);
        }

        // GET api/student/{studentId}/enrollments
        [HttpGet("{studentId:int}/enrollments")]
        [ProducesResponseType(typeof(OperationResult<System.Collections.Generic.IEnumerable<EnrolledCourseDto>>), 200)]
        public async Task<IActionResult> GetEnrolledCourses(int studentId, CancellationToken cancellationToken = default)
        {
            var res = await _studentService.GetEnrolledCoursesAsync(studentId, cancellationToken);
            return Ok(res);
        }

        // POST api/student/{studentId}/register
        [HttpPost("{studentId:int}/register")]
        [ProducesResponseType(typeof(OperationResult<EnrolledCourseDto>), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RegisterForCourse(int studentId, [FromBody] RegisterCourseDto dto, CancellationToken cancellationToken = default)
        {
            var res = await _studentService.RegisterForCourseAsync(studentId, dto, cancellationToken);
            if (!res.Success) return BadRequest(res);
            // Created with a simple Location-like URI to the student's enrollment resource.
            return Created($"/api/student/{studentId}/enrollments/{res.Data?.EnrollmentId}", res);
        }

        // DELETE api/student/{studentId}/enrollments (body: cancel request)
        [HttpDelete("{studentId:int}/enrollments")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CancelRegistration(int studentId, [FromBody] CancelRegistrationDto dto, CancellationToken cancellationToken = default)
        {
            var res = await _studentService.CancelRegistrationAsync(studentId, dto, cancellationToken);
            if (!res.Success) return BadRequest(res);
            return NoContent();
        }
    }
}