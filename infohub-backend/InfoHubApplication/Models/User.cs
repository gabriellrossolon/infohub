using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfoHubApplication.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        public int Id { get; private set; }
        public string Name { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public string Role { get; private set; }
        public int CompanyId { get; set; }

        public User() 
        {
            Name = string.Empty;
            Email = string.Empty;
            PasswordHash = string.Empty;
            Role = string.Empty;
            
        }

        public User(string name, string email, string password, string role, int companyId)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.Email = email;
            this.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password); ;
            this.Role = role;
            this.CompanyId = companyId;
        }

        public bool VerifyPassword(string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, PasswordHash);
        }
    }
}
