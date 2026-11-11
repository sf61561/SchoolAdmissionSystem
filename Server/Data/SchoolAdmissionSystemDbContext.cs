using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.Api.Enums;
using SchoolAdmissionSystem.Api.Models;

namespace SchoolAdmissionSystem.Api.Data;

public class SchoolAdmissionSystemDbContext(DbContextOptions<SchoolAdmissionSystemDbContext> options) : DbContext(options)
{
    public DbSet<Users> Users => Set<Users>();
    public DbSet<Classes> Classes => Set<Classes>();
    public DbSet<HoldSeat> HoldSeats => Set<HoldSeat>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<HoldSeat>(entity =>
        {
            entity.HasKey(h => h.Id);

            entity.Property(h => h.Id)
                .UseIdentityAlwaysColumn();

            entity.HasOne(h => h.Class)
                .WithMany()
                .HasForeignKey(h => h.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(h => h.User)
                .WithMany()
                .HasForeignKey(h => h.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.HasPostgresEnum<UserRole>(
            schema: "public",
            name: "UserRole"
        );
    }
}