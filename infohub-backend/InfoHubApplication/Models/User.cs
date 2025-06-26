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
        public int Password { get; private set; }
        public string Role { get; private set; }

        public User(string name, string email, int password, string role)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.Email = email;
            this.Password = password;
            this.Role = role;
        }
    }
}
