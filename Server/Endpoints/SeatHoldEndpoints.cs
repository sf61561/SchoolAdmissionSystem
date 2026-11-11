using SchoolAdmissionSystem.Api.Dtos;
using SchoolAdmissionSystem.Api.Enums;
namespace SchoolAdmissionSystem.Api.Endpoints;

public static class SeatHoldEndpoints
{
    public static List<SeatHoldDto> seatHoldDtos = [];

    public static void MapSeatHoldEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/holds");
        group.MapGet("/", () => Results.Ok(seatHoldDtos));
        group.MapGet("/{id}", (HttpRequest request, string id) => {
            var customeheader = request.Headers["X-Student-Id"].ToString();
            var seatHoldDto = seatHoldDtos.Find(seatHoldDto => seatHoldDto.holdId == id && seatHoldDto.studentId == customeheader);
            return seatHoldDto is not null ? Results.Ok(seatHoldDto) : Results.NotFound();
        });
        group.MapPut("/{id}/confirm", (HttpRequest request, string id) => {
            var customeheader = request.Headers["X-Student-Id"].ToString();
            var seatHoldDto = seatHoldDtos.Find(seatHoldDto => seatHoldDto.holdId == id && seatHoldDto.studentId == customeheader);
            if (seatHoldDto is null) return Results.NotFound();
            if (seatHoldDto.status != HoldStatus.Held) return Results.BadRequest("Seat hold is not in a valid state for confirmation.");
            SeatHoldDto updatedSeatHoldDto = new SeatHoldDto(
                seatHoldDto.holdId,
                seatHoldDto.classId,
                seatHoldDto.studentId,
                seatHoldDto.expiresAt,
                HoldStatus.Confirmed
            );
            seatHoldDtos[seatHoldDtos.FindIndex(s => s.holdId == id)] = updatedSeatHoldDto;
            return Results.Ok(updatedSeatHoldDto);
        });
        group.MapDelete("/{id}", (HttpRequest request,string id) => {
            var customeheader = request.Headers["X-Student-Id"].ToString();
            if (string.IsNullOrEmpty(customeheader)) return Results.BadRequest("Student ID is required.");
            var seatHoldDto = seatHoldDtos.Find(seatHoldDto => seatHoldDto.holdId == id && seatHoldDto.studentId == customeheader);
            var removed = seatHoldDtos.RemoveAll(seatHoldDto => seatHoldDto.holdId == id);
            return removed > 0 ? Results.NoContent() : Results.NotFound();
        });
        app.MapGet("/me/holds", (HttpRequest request) => {
            var customeheader = request.Headers["X-Student-Id"].ToString();
            var studentHolds = seatHoldDtos.FindAll(seatHoldDto => seatHoldDto.studentId == customeheader);
            return Results.Ok(studentHolds);
        });
    }
}