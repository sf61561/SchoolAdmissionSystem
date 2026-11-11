namespace SchoolAdmissionSystem.Api.Dtos;

using System.ComponentModel.DataAnnotations;
using SchoolAdmissionSystem.Api.Enums;
public record class LoginUserDto(
    [Required] string Id,
    [Required] string password
);