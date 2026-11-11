using System.ComponentModel.DataAnnotations;

namespace SchoolAdmissionSystem.Api.Dtos;

public record CreateClassDto(
    [Required] string name,
    int totalSeat =0
);