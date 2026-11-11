using SchoolAdmissionSystem.Api.Enums;

namespace SchoolAdmissionSystem.Api.Models;

public class Users
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
    public UserRole Role { get; set; } = UserRole.Student;
}