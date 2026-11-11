using System.ComponentModel.DataAnnotations;
using SchoolAdmissionSystem.Api.Enums;

namespace SchoolAdmissionSystem.Api.Dtos;

public record class SeatHoldDto(
    [Required] string holdId,
    [Required] string classId,
    [Required]string studentId,
    DateTime expiresAt,
    HoldStatus status=HoldStatus.Held
);