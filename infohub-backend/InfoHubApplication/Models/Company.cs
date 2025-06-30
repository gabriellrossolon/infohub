using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfoHubApplication.Models
{
    [Table("companies")]
    public class Company
    {
        [Key]
        public int Id { get; private set; }
        public string Name { get; private set; }

        public Company(string name)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }
}
