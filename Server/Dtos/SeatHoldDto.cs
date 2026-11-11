using System.ComponentModel.DataAnnotations;
using SchoolAdmissionSystem.Api.Enums;

namespace SchoolAdmissionSystem.Api.Dtos;

public record class SeatHoldDto(
    [Required] int Id,
    [Required] int classId,
    [Required]string studentId,
    DateTime expiresAt,
    HoldStatus status=HoldStatus.Held
);