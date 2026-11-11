using SchoolAdmissionSystem.Api.Enums;

namespace SchoolAdmissionSystem.Api.Models;

public class HoldSeat
{
    public string Id { get; set; } = string.Empty;
    public string ClassId { get; set; } = string.Empty;
    public Users? Users { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public HoldStatus Status { get; set; } = HoldStatus.Held;
}