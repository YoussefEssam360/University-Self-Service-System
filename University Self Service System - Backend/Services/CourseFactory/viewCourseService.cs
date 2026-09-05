using Microsoft.EntityFrameworkCore;
using University_Self_Service_System___Backend.DTOs.CourseDTOs;

namespace University_Self_Service_System___Backend.Services.CourseFactory
{
    public partial class courseServices
    {
        public async Task<List<RviewCourseDto>> viewCourses()
        {
            return await _context.Courses
                .OrderBy(course => course.Code)
                .Select(course => new RviewCourseDto
                {
                    Id = course.Id,
                    CourseCode = course.Code,
                    Title = course.Title,
                    CreditHours = course.CreditHours,
                    ProfessorId = course.ProfessorId,
                    ProfessorName = course.Professor != null
                        ? (course.Professor.FullName ?? course.Professor.Name)
                        : "Not Assigned",
                    Capacity = course.Capacity,
                    StartDate = course.StartDate,
                    EndDate = course.EndDate,
                    EnrolledStudents = course.Enrollments
                        .Select(enrollment => new StudentInCourseDto
                        {
                            StudentId = enrollment.StudentId,
                            Name = enrollment.Student != null
                                ? (enrollment.Student.FullName ?? enrollment.Student.Name)
                                : string.Empty,
                            Email = enrollment.Student != null ? enrollment.Student.Email : string.Empty
                        })
                        .ToList()
                })
                .ToListAsync();
        }
    }
}
