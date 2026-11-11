using System.ComponentModel.DataAnnotations;
using SchoolAdmissionSystem.Api.Enums;

namespace SchoolAdmissionSystem.Api.Dtos;
public record class CreateUserDto(
    [Required] string Id,
    [Required] string FullName,
    [Required][EmailAddress(ErrorMessage = "Invalid email address")] string Email,
    [Required][RegularExpression(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "Password must contain uppercase, lowercase, number and special character"
    )] string Password,
    [Required] UserRole Role = UserRole.Student
);