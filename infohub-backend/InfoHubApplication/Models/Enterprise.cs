using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfoHubApplication.Models
{
    [Table("enterprises")]
    public class Enterprise
    {
        [Key]
        public int Id { get; private set; }
        public string Name { get; private set; }
        public DateTime CreationDate { get; private set; }
        public int CompanyId { get; set; }

        public Enterprise(string name, int companyId)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.CreationDate = DateTime.UtcNow;
            this.CompanyId = companyId;
        }
    }
}
