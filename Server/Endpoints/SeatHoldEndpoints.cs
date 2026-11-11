using SchoolAdmissionSystem.Api.Data;
using SchoolAdmissionSystem.Api.Dtos;
using SchoolAdmissionSystem.Api.Enums;
using Microsoft.EntityFrameworkCore;
namespace SchoolAdmissionSystem.Api.Endpoints;

public static class SeatHoldEndpoints
{
    public static void MapSeatHoldEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/holds");
        group.MapGet("/", async (SchoolAdmissionSystemDbContext db) => Results.Ok(await db.HoldSeats.ToListAsync()));
        group.MapGet("/{id}", async (HttpRequest request, int id, SchoolAdmissionSystemDbContext db) => {
            var customeheader = request.Headers["X-Student-Id"].ToString();
            if (string.IsNullOrEmpty(customeheader)) return Results.BadRequest("Student ID is required.");
            var seatHoldDto = await db.HoldSeats
                .Where(seatHold => seatHold.Id == id && seatHold.StudentId == customeheader)
                .Select(seatHold => new SeatHoldDto(
                    seatHold.Id,
                    seatHold.ClassId,
                    seatHold.StudentId,
                    seatHold.ExpiresAt,
                    seatHold.Status
                ))
                .FirstOrDefaultAsync();
            return seatHoldDto is not null ? Results.Ok(seatHoldDto) : Results.NotFound();
        });
        group.MapPut("/{id}/confirm", async (HttpRequest request,int id,SchoolAdmissionSystemDbContext db) =>
        {
            var studentId = request.Headers["X-Student-Id"].ToString();
            if (string.IsNullOrWhiteSpace(studentId)) return Results.BadRequest("Student ID is required.");
            await using var transaction = await db.Database.BeginTransactionAsync();
            var seatHold = await db.HoldSeats
                .FirstOrDefaultAsync(h =>h.Id == id && h.StudentId == studentId);
            if (seatHold is null) return Results.NotFound("Seat hold not found.");
            if (seatHold.Status != HoldStatus.Held) return Results.BadRequest("Seat is already confirmed or is not in held status.");
            if (seatHold.ExpiresAt <= DateTime.Now) return Results.BadRequest("Seat hold has expired.");
            var updatedRows = await db.Classes
                .Where(c => c.Id == seatHold.ClassId && c.HeldSeat > 0)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(c => c.HeldSeat, c => c.HeldSeat - 1)
                    .SetProperty(c => c.ConfirmedSeat, c => c.ConfirmedSeat + 1));
            if (updatedRows == 0) return Results.BadRequest("Unable to confirm this seat.");
            seatHold.Status = HoldStatus.Confirmed;
            await db.SaveChangesAsync();
            await transaction.CommitAsync();
            var response = new SeatHoldDto(
                seatHold.Id,
                seatHold.ClassId,
                seatHold.StudentId,
                seatHold.ExpiresAt,
                seatHold.Status
            );
            return Results.Ok(response);
        });
        group.MapDelete("/{id}", async (HttpRequest request, int id, SchoolAdmissionSystemDbContext db) =>
        {
            var studentId = request.Headers["X-Student-Id"].ToString();
            if (string.IsNullOrWhiteSpace(studentId)) return Results.BadRequest("Student ID is required.");
            await using var transaction = await db.Database.BeginTransactionAsync();
            var seatHold = await db.HoldSeats
                .FirstOrDefaultAsync(h => h.Id == id && h.StudentId == studentId);
            if (seatHold is null) return Results.NotFound("Seat hold not found.");
            if (seatHold.Status != HoldStatus.Held) return Results.BadRequest("This seat hold is already processed.");
            var isExpired = seatHold.ExpiresAt <= DateTime.Now;
            var updatedRows = await db.Classes
                .Where(c => c.Id == seatHold.ClassId && c.HeldSeat > 0)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(c => c.HeldSeat, c => c.HeldSeat - 1)
                    .SetProperty(c => c.AvailableSeat, c => c.AvailableSeat + 1));
            if (updatedRows == 0) return Results.BadRequest("Unable to release this seat.");
            seatHold.Status = isExpired ? HoldStatus.Expired : HoldStatus.Canceled;
            await db.SaveChangesAsync();
            await transaction.CommitAsync();
            return Results.Ok(new
            {
                message = isExpired? "Seat hold expired." : "Seat hold cancelled.",
                status = seatHold.Status
            });
        });
        app.MapGet("/me/holds", async (HttpRequest request, SchoolAdmissionSystemDbContext db) => {
            var studentId = request.Headers["X-Student-Id"].ToString();
            if (string.IsNullOrWhiteSpace(studentId)) return Results.BadRequest("Student ID is required.");
            var studentHolds = await db.HoldSeats
                .Where(h => h.StudentId == studentId)
                .Select(h => new SeatHoldDto(
                    h.Id,
                    h.ClassId,
                    h.StudentId,
                    h.ExpiresAt,
                    h.Status
                ))
                .ToListAsync();
            return Results.Ok(studentHolds);
        });
    }
}