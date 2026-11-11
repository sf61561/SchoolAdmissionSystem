using SchoolAdmissionSystem.Api.Dtos;
using SchoolAdmissionSystem.Api.Enums;
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
        group.MapGet("/", () => Results.Ok(classesDtos));
        group.MapGet("/{id}", (int id) =>{
            var classesDto = classesDtos.Find(classesDto => classesDto.id == id.ToString());
            return classesDto is not null ? Results.Ok(classesDto) : Results.NotFound();
        })
        .WithName("GetClass");
        group.MapPost("/", (CreateClassDto createClassDto) =>
        {
            ClassesDto classesDto = new ClassesDto(
                (classesDtos.Count + 1).ToString(),
                createClassDto.name,
                createClassDto.totalSeat,
                0,
                0,
                createClassDto.totalSeat
            );
            classesDtos.Add(classesDto);
            return Results.Created($"classes/{classesDto.id}", classesDto);
        });
        group.MapPost("/{id}/holds",(HttpContext context, int id) => {
            var customeheader = context.Request.Headers["X-Student-Id"].ToString();
            var classesDto = classesDtos.Find(classesDto => classesDto.id == id.ToString());
            if (classesDto is null) return Results.NotFound();
            if (classesDto.availableSeat <= 0) return Results.BadRequest("No available seats in this class.");
            SeatHoldDto seatHoldDto = new SeatHoldDto(
                (SeatHoldEndpoints.seatHoldDtos.Count + 1).ToString(),
                id.ToString(),
                customeheader,
                DateTime.Now.AddMinutes(10),
                HoldStatus.Held
            );
            ClassesDto updatedClassDto = new ClassesDto(
                classesDto.id,
                classesDto.name,
                classesDto.totalSeat,
                classesDto.heldSeat + 1,
                classesDto.confirmedSeat,
                classesDto.availableSeat - 1
            );
            classesDtos[classesDtos.FindIndex(c => c.id == id.ToString())] = updatedClassDto;
            SeatHoldEndpoints.seatHoldDtos.Add(seatHoldDto);
            return Results.Created($"holds/{seatHoldDto.holdId}", seatHoldDto);
        });
    }
}