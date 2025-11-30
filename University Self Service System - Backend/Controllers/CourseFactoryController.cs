using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using University_Self_Service_System___Backend.Services.CourseFactory;
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
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
        {
            var result = await _courseService.CreateCourse(dto);
            return Ok(result);
        }

        [HttpDelete("{delete}")]
        public async Task<IActionResult> deleteCourse([FromBody] deleteCourseDto dto)
        {
            var result = await _courseService.deleteCourse(dto);
            return Ok(result);
        }



    }
}
