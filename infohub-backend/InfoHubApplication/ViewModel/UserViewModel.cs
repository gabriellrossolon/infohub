using System.ComponentModel.DataAnnotations;

public class UserViewModel
{
    [Required]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    public string Role { get; set; }
    public int CompanyId { get; set; }
}