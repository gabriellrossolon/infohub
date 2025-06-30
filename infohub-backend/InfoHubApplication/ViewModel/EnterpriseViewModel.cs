using System.ComponentModel.DataAnnotations;

public class EnterpriseViewModel
{
    [Required]
    public string Name { get; set; }
    [Required]
    public int CompanyId { get; set; }
}