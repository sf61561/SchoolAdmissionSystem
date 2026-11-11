using System.ComponentModel.DataAnnotations;

namespace SchoolAdmissionSystem.Api.Dtos;
public record class UpdateUserDto(
    [Required] string FullName,
    [Required] DateTime UpdatedAt
);