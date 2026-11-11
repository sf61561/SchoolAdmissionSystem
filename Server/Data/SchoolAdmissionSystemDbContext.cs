using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.Api.Models;

namespace SchoolAdmissionSystem.Api.Data;

public class SchoolAdmissionSystemDbContext(DbContextOptions<SchoolAdmissionSystemDbContext> options) : DbContext(options)
{
    DbSet<Users> Users => Set<Models.Users>();
    DbSet<Classes> Classes => Set<Models.Classes>();
    DbSet<HoldSeat> HoldSeats => Set<Models.HoldSeat>();
}