using SchoolAdmissionSystem.Api.Endpoints;
using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.Api.Data;
using DotNetEnv;
using Microsoft.AspNetCore.Identity;
using SchoolAdmissionSystem.Api.Models;
using SchoolAdmissionSystem.Api.Enums;
Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddValidation();
builder.Services.AddScoped<
    IPasswordHasher<Users>,
    PasswordHasher<Users>
>();
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "DATABASE_URL environment variable is missing."
    );
}

// Register PostgreSQL
builder.Services.AddDbContext<SchoolAdmissionSystemDbContext>(options =>
    options.UseNpgsql(connectionString, npgsql =>
        npgsql.MapEnum<UserRole>("UserRole")
    )
);
var app = builder.Build();

app.MapGet("/db-test", async (SchoolAdmissionSystemDbContext db) =>
{
    try
    {
        var isConnected = await db.Database.CanConnectAsync();

        if (!isConnected)
        {
            return Results.Problem("Database connection failed.");
        }

        return Results.Ok(new
        {
            message = "PostgreSQL connected successfully!",
            connected = true
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            title : "Database connection failed",
            detail: ex.Message
        );
    }
});

app.MapUserEndpoints();
app.MapClassEndpoints();
app.MapSeatHoldEndpoints();

app.Run();
