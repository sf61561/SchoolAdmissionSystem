using SchoolAdmissionSystem.Api.Dtos;
namespace SchoolAdmissionSystem.Api.Endpoints;

public static class UserEndpoints
{
    private static readonly List<UserDto> userdtos = [
        new ("1","Syed Fahad Mahmud", "sf61561@gmail.com", "password123", DateTime.Now, DateTime.Now),
        new ("2","Syed Fahad Mahmud", "tausifmayeen@gmail.com", "password456", DateTime.Now, DateTime.Now)
    ];
    public static void MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/users");
        group.MapGet("/", () => userdtos);
        group.MapGet("/{id}", (int id) =>{
            var user = userdtos.Find(userdtos => userdtos.Id == id.ToString());
            return user is not null ? Results.Ok(user) : Results.NotFound();
        })
        .WithName("GetUser");
        app.MapPost("/register", (CreateUserDto createuserdto) =>
        {
            UserDto userdto = new UserDto(
                createuserdto.Id,
                createuserdto.FullName,
                createuserdto.Email,
                createuserdto.Password,
                DateTime.Now,
                DateTime.Now
            );
            userdtos.Add(userdto);
            return Results.Created($"users/{userdto.Id}", userdto);
        });

        group.MapPut("/{id}", (int id, UpdateUserDto updateuserdto) =>{
            var userdto = userdtos.Find(userdto => userdto.Id == id.ToString());
            if (userdto is null) return Results.NotFound();
            int Index = userdtos.FindIndex(userdto => userdto.Id == id.ToString());
            userdtos[Index] = new UserDto(
                userdto.Id,
                updateuserdto.FullName,
                userdto.Email,
                userdto.Password,
                userdto.CreatedAt,
                DateTime.Now
            );
            return Results.NoContent();
        });

        group.MapDelete("/{id}", (int id) => {
            var userdto = userdtos.Find(userdto => userdto.Id == id.ToString());
            if (userdto is null) return Results.NotFound();
            userdtos.RemoveAll(userdto => userdto.Id == id.ToString());
            return Results.NoContent();
        });
    }
}