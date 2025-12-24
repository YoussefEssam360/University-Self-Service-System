using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using University_Self_Service_System___Backend.Services.CourseFactory;

namespace University_Self_Service_System___Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseFactoryController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseFactoryController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var result = await _courseService.CreateCourse(dto);
            return Ok(result);
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> deleteCourse([FromBody] deleteCourseDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Code))
            {
                return BadRequest();
            }

            var result = await _courseService.deleteCourse(dto.Code);
            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> updateCourse([FromBody] updateCourseDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var result = await _courseService.updateCourse(dto);

            if (!result.done)
            {
                // Course not found or invalid input
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> viewCourses()
        {
            var result = await _courseService.viewCourses();
            return Ok(result);
        }
    }
}
