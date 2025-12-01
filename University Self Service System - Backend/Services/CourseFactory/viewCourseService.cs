using University_Self_Service_System___Backend.DTOs.CourseDTOs;
using Microsoft.EntityFrameworkCore;


namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices
    {
        public async Task<List<RviewCourseDto>> viewCourses()
        {


            // 1. Project directly from the database query (IQueryable)
            var courseDtos = await _context.Courses
                .Select(c => new RviewCourseDto
                {
                    // Simple direct mappings
                    CourseCode = c.Code ,
                    Title = c.Title,
                    CreditHours = c.CreditHours,

                    // 🌟 Complex Mapping Handled Here:
                    // We access the navigation property 'Professor' and get its 'Name'.
                    // EF Core translates this into an efficient SQL JOIN operation.
                    ProfessorName = c.Professor != null
                        ? c.Professor.Name                      // Value if Professor is NOT NULL
                        : "Not Assigned"

                    // Note: If RviewCourseDto doesn't have all these properties,
                    // adjust them to match your DTO fields.
                })
                // 2. Execute the query and materialize the List<RviewCourseDto>
                .ToListAsync();

           


            return courseDtos;
        }


    }
}
