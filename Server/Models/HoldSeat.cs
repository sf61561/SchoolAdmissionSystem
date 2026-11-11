using SchoolAdmissionSystem.Api.Enums;

namespace SchoolAdmissionSystem.Api.Models;

public class HoldSeat
{
    public int Id { get; set; }

    // Foreign key referencing Classes.Id
    public int ClassId { get; set; }
    public Classes? Class { get; set; }

    // Foreign key referencing Users.Id
    public string StudentId { get; set; } = string.Empty;
    public Users? User { get; set; }

    public DateTime ExpiresAt { get; set; }

    public HoldStatus Status { get; set; } = HoldStatus.Held;
}