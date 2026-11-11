namespace SchoolAdmissionSystem.Api.Dtos;

using System.ComponentModel.DataAnnotations;
using SchoolAdmissionSystem.Api.Enums;
public record class LoginUserDto(
    string Id,
    string Email,
    [Required] string password
);