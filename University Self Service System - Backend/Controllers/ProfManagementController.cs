using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using University_Self_Service_System___Backend.DTOs.ProfessorDTOs;
using University_Self_Service_System___Backend.Services.ProfManagement;

namespace University_Self_Service_System___Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfessor([FromBody] UpdateProfessorDto dto)
        {
            var result = await _profManagementService.UpdateProfessor(dto);
            return Ok(result);
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
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProfessor([FromBody] DeleteProfessorDto dto)
        {
            var result = await _profManagementService.DeleteProfessor(dto);
            return Ok(result);
        }
    }
}