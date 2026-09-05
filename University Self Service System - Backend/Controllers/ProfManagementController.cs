using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;
using University_Self_Service_System___Backend.Services.ProfManagement;

namespace University_Self_Service_System___Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ProfManagementController : ControllerBase
    {
        private readonly IProfManagementService _profManagementService;

        public ProfManagementController(IProfManagementService profManagementService)
        {
            _profManagementService = profManagementService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfessor([FromBody] CreateProfessorDto dto)
        {
            var result = await _profManagementService.CreateProfessor(dto);
            return result.Success
                ? CreatedAtAction(nameof(ViewProfessorById), new { id = result.Id }, result)
                : BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfessor([FromBody] UpdateProfessorDto dto)
        {
            var result = await _profManagementService.UpdateProfessor(dto);
            if (result.ProfessorNotFound) return NotFound(result);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet]
        public async Task<IActionResult> ViewProfessors()
        {
            var result = await _profManagementService.ViewProfessors();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ViewProfessorById(int id)
        {
            var result = await _profManagementService.ViewProfessorById(id);
            return result.ProfessorNotFound ? NotFound(result) : Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProfessor([FromBody] DeleteProfessorDto dto)
        {
            var result = await _profManagementService.DeleteProfessor(dto);
            if (result.ProfessorNotFound) return NotFound(result);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
