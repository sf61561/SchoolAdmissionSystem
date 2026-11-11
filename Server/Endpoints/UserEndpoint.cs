using Microsoft.AspNetCore.Identity;
using SchoolAdmissionSystem.Api.Data;
using SchoolAdmissionSystem.Api.Dtos;
using SchoolAdmissionSystem.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace SchoolAdmissionSystem.Api.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/users");
        group.MapGet("/", async(SchoolAdmissionSystemDbContext db) =>
        {
            var users = await db.Users
                .Select(user => new UserDto(
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.CreatedAt,
                    user.UpdatedAt
                ))
                .ToListAsync();
            return users is not null ? Results.Ok(users) : Results.NotFound();
        });
        group.MapGet("/{id}", async (string id, SchoolAdmissionSystemDbContext db) =>{
            var user = await db.Users
                .Where(user => user.Id == id)
                .Select(user => new UserDto(
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.CreatedAt,
                    user.UpdatedAt
                ))
                .FirstOrDefaultAsync();
            return user is not null ? Results.Ok(user) : Results.NotFound();
        })
        .WithName("GetUser");
        app.MapPost("/register", async(CreateUserDto createuserdto,SchoolAdmissionSystemDbContext db,IPasswordHasher<Users> passwordHasher) =>
        {
            var IdExists = await db.Users.AnyAsync(user => user.Id == createuserdto.Id);
            if (IdExists)
            {
                return Results.Conflict(new
                {
                    message = "Id already exists."
                });
            }
            var emailExists = await db.Users
                .AnyAsync(user => user.Email == createuserdto.Email);

            if (emailExists)
            {
                return Results.Conflict(new
                {
                    message = "Email already exists."
                });
            }
            var FullNameExists = await db.Users.AnyAsync(user => user.FullName.ToLower() == createuserdto.FullName.ToLower());
            if (FullNameExists)
            {
                return Results.Conflict(new
                {
                    message = "FullName already exists."
                });
            }
            var user = new Users
            {
                Id = createuserdto.Id,
                FullName = createuserdto.FullName,
                Email = createuserdto.Email,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Role = createuserdto.Role
            };
            user.Password = passwordHasher.HashPassword(
                user,
                createuserdto.Password
            );
            db.Users.Add(user);
            await db.SaveChangesAsync();
            var response = new UserDto(
                user.Id,
                user.FullName,
                user.Email,
                user.CreatedAt,
                user.UpdatedAt
            );
            return Results.Created($"/users/{user.Id}", response);
        });
        group.MapPut("/{id}", async (int id, UpdateUserDto updateuserdto, SchoolAdmissionSystemDbContext db) => 
        {
            var user = await db.Users.FindAsync(id.ToString());
            if (user is null)
            {
                return Results.NotFound(new
                {
                    message = "User not found."
                });
            }
            user.FullName = updateuserdto.FullName;
            user.UpdatedAt = DateTime.Now;
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
        app.MapPost("/login", async (LoginUserDto loginuserdto, SchoolAdmissionSystemDbContext db, IPasswordHasher<Users> passwordHasher) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == loginuserdto.Id || u.Email == loginuserdto.Email);
            if (user is null)
            {
                return Results.NotFound(new
                {
                    message = "User not found."
                });
            }
            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(
                user,
                user.Password,
                loginuserdto.password
            );
            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                return Results.Unauthorized();
            }
            var response = new UserDto(
                user.Id,
                user.FullName,
                user.Email,
                user.CreatedAt,
                user.UpdatedAt,
                user.Role == Enums.UserRole.Admin ? Enums.UserRole.Admin : Enums.UserRole.Student
            );
            return Results.Ok(response);
        });
    }
}