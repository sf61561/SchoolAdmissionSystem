using System.ComponentModel.DataAnnotations;

namespace SchoolAdmissionSystem.Api.Dtos;
public record class ClassesDto(
    [Required] string id,
    [Required] string name,
    int totalSeat,
    int heldSeat,
    int confirmedSeat,
    int availableSeat
);