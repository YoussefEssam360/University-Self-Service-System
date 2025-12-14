using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using University_Self_Service_System___Backend.Data;
using University_Self_Service_System___Backend.DTOs.StudentDTOs;
using University_Self_Service_System___Backend.Entities;

namespace University_Self_Service_System___Backend.Services.StudentServices
{
    public class StudentService : IStudentService
    {
        private readonly AppDbContext _db;
        private readonly ILogger<StudentService> _logger;

        public StudentService(AppDbContext db, ILogger<StudentService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<OperationResult<StudentProfileDto>> GetProfileAsync(int studentId, CancellationToken cancellationToken = default)
        {
            var result = new OperationResult<StudentProfileDto>();
            var student = await _db.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == studentId, cancellationToken);

            if (student == null)
            {
                result.Success = false;
                result.Message = "Student not found.";
                return result;
            }

            result.Data = new StudentProfileDto
            {
                Id = student.Id,
                FullName = student.FullName ?? student.User?.FullName,
                Email = student.User?.Email,
                PhoneNumber = student.PhoneNumber,
                DateOfBirth = student.DateOfBirth,
                Major = student.Major
            };

            return result;
        }

        public async Task<OperationResult<StudentProfileDto>> UpdateProfileAsync(int studentId, StudentUpdateDto updateDto, CancellationToken cancellationToken = default)
        {
            var result = new OperationResult<StudentProfileDto>();

            var student = await _db.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == studentId, cancellationToken);

            if (student == null)
            {
                result.Success = false;
                result.Message = "Student not found.";
                return result;
            }

            if (!string.IsNullOrWhiteSpace(updateDto.FullName))
            {
                student.FullName = updateDto.FullName;
                if (student.User != null)
                    student.User.FullName = updateDto.FullName;
            }

            if (!string.IsNullOrWhiteSpace(updateDto.Email) && student.User != null)
            {
                student.User.Email = updateDto.Email;
            }

            if (!string.IsNullOrWhiteSpace(updateDto.PhoneNumber))
                student.PhoneNumber = updateDto.PhoneNumber;

            if (updateDto.DateOfBirth.HasValue)
                student.DateOfBirth = updateDto.DateOfBirth;

            if (!string.IsNullOrWhiteSpace(updateDto.Major))
                student.Major = updateDto.Major;

            await _db.SaveChangesAsync(cancellationToken);

            result.Message = "Profile updated.";
            result.Data = new StudentProfileDto
            {
                Id = student.Id,
                FullName = student.FullName ?? student.User?.FullName,
                Email = student.User?.Email,
                PhoneNumber = student.PhoneNumber,
                DateOfBirth = student.DateOfBirth,
                Major = student.Major
            };

            return result;
        }

        public async Task<OperationResult<IEnumerable<EnrolledCourseDto>>> GetEnrolledCoursesAsync(int studentId, CancellationToken cancellationToken = default)
        {
            var result = new OperationResult<IEnumerable<EnrolledCourseDto>>();

            var enrollments = await _db.Enrollments
                .Where(e => e.StudentId == studentId)
                .Include(e => e.Course)
                .ToListAsync(cancellationToken);

            var dtos = enrollments.Select(e => new EnrolledCourseDto
            {
                EnrollmentId = e.Id,
                CourseId = e.CourseId,
                CourseTitle = e.Course?.Title,
                CourseCode = e.Course?.Code,
                InstructorName = e.Course?.InstructorName,
                StartDate = e.Course?.StartDate,
                EndDate = e.Course?.EndDate
            }).ToList();

            result.Data = dtos;
            result.Message = "Enrolled courses retrieved.";
            return result;
        }

        public async Task<OperationResult<EnrolledCourseDto>> RegisterForCourseAsync(int studentId, RegisterCourseDto registerDto, CancellationToken cancellationToken = default)
        {
            var result = new OperationResult<EnrolledCourseDto>();

            var course = await _db.Courses
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.Id == registerDto.CourseId, cancellationToken);

            if (course == null)
            {
                result.Success = false;
                result.Message = "Course not found.";
                return result;
            }

            var enrolledCount = await _db.Enrollments.CountAsync(e => e.CourseId == course.Id, cancellationToken);
            if (course.Capacity > 0 && enrolledCount >= course.Capacity)
            {
                result.Success = false;
                result.Message = "Course is full.";
                return result;
            }

            var already = await _db.Enrollments.AnyAsync(e => e.CourseId == course.Id && e.StudentId == studentId, cancellationToken);
            if (already)
            {
                result.Success = false;
                result.Message = "Student is already enrolled in this course.";
                return result;
            }

            var student = await _db.Students.FindAsync(new object[] { studentId }, cancellationToken);
            if (student == null)
            {
                result.Success = false;
                result.Message = "Student not found.";
                return result;
            }

            var enrollment = new Enrollment
            {
                CourseId = course.Id,
                StudentId = studentId,
                EnrolledAt = DateTime.UtcNow
            };

            _db.Enrollments.Add(enrollment);
            await _db.SaveChangesAsync(cancellationToken);

            result.Data = new EnrolledCourseDto
            {
                EnrollmentId = enrollment.Id,
                CourseId = course.Id,
                CourseTitle = course.Title,
                CourseCode = course.Code,
                InstructorName = course.InstructorName,
                StartDate = course.StartDate,
                EndDate = course.EndDate
            };

            result.Message = "Enrolled successfully.";
            return result;
        }

        public async Task<OperationResult<bool>> CancelRegistrationAsync(int studentId, CancelRegistrationDto cancelDto, CancellationToken cancellationToken = default)
        {
            var result = new OperationResult<bool>();

            Enrollment? enrollment = null;

            if (cancelDto.EnrollmentId.HasValue)
            {
                enrollment = await _db.Enrollments.FirstOrDefaultAsync(e => e.Id == cancelDto.EnrollmentId.Value && e.StudentId == studentId, cancellationToken);
            }
            else if (cancelDto.CourseId.HasValue)
            {
                enrollment = await _db.Enrollments.FirstOrDefaultAsync(e => e.CourseId == cancelDto.CourseId.Value && e.StudentId == studentId, cancellationToken);
            }
            else
            {
                result.Success = false;
                result.Message = "Provide EnrollmentId or CourseId to cancel.";
                return result;
            }

            if (enrollment == null)
            {
                result.Success = false;
                result.Message = "Enrollment not found.";
                return result;
            }

            _db.Enrollments.Remove(enrollment);
            await _db.SaveChangesAsync(cancellationToken);

            result.Data = true;
            result.Message = "Registration canceled.";
            return result;
        }
    }
}