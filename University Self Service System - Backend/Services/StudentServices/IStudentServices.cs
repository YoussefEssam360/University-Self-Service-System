using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using University_Self_Service_System___Backend.DTOs.StudentDTOs;

namespace University_Self_Service_System___Backend.Services.StudentServices
{
   
    public interface IStudentService
    {
        Task<OperationResult<StudentProfileDto>> GetProfileAsync(int studentId, CancellationToken cancellationToken = default);
        Task<OperationResult<StudentProfileDto>> UpdateProfileAsync(int studentId, StudentUpdateDto updateDto, CancellationToken cancellationToken = default);

        Task<OperationResult<IEnumerable<EnrolledCourseDto>>> GetEnrolledCoursesAsync(int studentId, CancellationToken cancellationToken = default);
        Task<OperationResult<EnrolledCourseDto>> RegisterForCourseAsync(int studentId, RegisterCourseDto registerDto, CancellationToken cancellationToken = default);
        Task<OperationResult<bool>> CancelRegistrationAsync(int studentId, CancelRegistrationDto cancelDto, CancellationToken cancellationToken = default);
    }
}