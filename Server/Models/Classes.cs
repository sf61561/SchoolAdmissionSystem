namespace SchoolAdmissionSystem.Api.Models;

public class Classes
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int TotalSeat { get; set; }
    public int HeldSeat { get; set; }
    public int ConfirmedSeat { get; set; }
    public int AvailableSeat { get; set; }
}