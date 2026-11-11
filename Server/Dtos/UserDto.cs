namespace SchoolAdmissionSystem.Api.Dtos;

using System.ComponentModel.DataAnnotations;
using SchoolAdmissionSystem.Api.Enums;
public record class UserDto(
    [Required] string Id,
    [Required] string FullName,
    [Required] string Email,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    [Required] UserRole Role = UserRole.Student
);