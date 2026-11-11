using SchoolAdmissionSystem.Api.Data;
using SchoolAdmissionSystem.Api.Dtos;
using SchoolAdmissionSystem.Api.Enums;
using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.Api.Models;
namespace SchoolAdmissionSystem.Api.Endpoints;

public static class ClassEndpoints
{
    private static readonly List<ClassesDto> classesDtos = [
        new ("1", "Class 1", 30, 5, 20, 5),
        new ("2", "Class 2", 25, 3, 15, 7),
        new ("3", "Class 3", 20, 2, 10, 8)
    ];

    public static void MapClassEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/classes");
        group.MapGet("/", async (SchoolAdmissionSystemDbContext db) => Results.Ok(await db.Classes.ToListAsync()));
        group.MapGet("/{id}", async (int id, SchoolAdmissionSystemDbContext db) =>{
            var classes = await db.Classes.FindAsync(id);
            return classes is not null ? Results.Ok(classes) : Results.NotFound();
        })
        .WithName("GetClass");
        group.MapPost("/", async (CreateClassDto createClassDto, SchoolAdmissionSystemDbContext db) =>
        {
            var classExists = await db.Classes.AnyAsync(c => c.Name == createClassDto.name);
            if (classExists)
            {
                return Results.Conflict(new
                {
                    message = "Class already exists."
                });
            }
            var newclass = new Classes{
                Name = createClassDto.name,
                TotalSeat = createClassDto.totalSeat,
                HeldSeat = 0,
                ConfirmedSeat = 0,
                AvailableSeat = createClassDto.totalSeat
            };
            db.Classes.Add(newclass);
            await db.SaveChangesAsync();
            return Results.Created($"classes/{newclass.Id}", newclass);
        });
        group.MapPost("/{id}/holds", async (int id,HttpContext context,SchoolAdmissionSystemDbContext db) =>
        {
            // 1. Get student ID from request header
            var studentId = context.Request.Headers["X-Student-Id"].ToString();
            if (string.IsNullOrWhiteSpace(studentId))
            {
                return Results.BadRequest(new
                {
                    message = "X-Student-Id header is required."
                });
            }
            await using var transaction = await db.Database.BeginTransactionAsync();
            var classExists = await db.Classes
                .AnyAsync(c => c.Id == id);
            if (!classExists)
            {
                return Results.NotFound(new
                {
                    message = "Class not found."
                });
            }
            var studentExists = await db.Users
                .AnyAsync(u => u.Id == studentId);

            if (!studentExists)
            {
                return Results.NotFound(new
                {
                    message = "Student not found."
                });
            }
            var updatedRows = await db.Classes
                .Where(c => c.Id == id && c.AvailableSeat > 0)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(c => c.HeldSeat, c => c.HeldSeat + 1)
                    .SetProperty(c => c.AvailableSeat, c => c.AvailableSeat - 1)
                );

            if (updatedRows == 0)
            {
                return Results.BadRequest(new
                {
                    message = "No available seats in this class."
                });
            }
            var seatHold = new HoldSeat
            {
                ClassId = id,
                StudentId = studentId,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                Status = HoldStatus.Held
            };
            db.HoldSeats.Add(seatHold);
            await db.SaveChangesAsync();
            await transaction.CommitAsync();
            return Results.Created(
                $"/holds/{seatHold.Id}",
                new
                {
                    id = seatHold.Id,
                    classId = seatHold.ClassId,
                    studentId = seatHold.StudentId,
                    expiresAt = seatHold.ExpiresAt,
                    status = seatHold.Status
                }
            );
        });
    }
}