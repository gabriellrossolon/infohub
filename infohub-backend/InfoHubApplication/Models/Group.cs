using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfoHubApplication.Models
{
    [Table("groups")]
    public class Group
    {
        [Key]
        public int Id { get; private set; }
        public string Name { get; private set; }
        public int CompanyId {  get; private set; }
        public DateTime CreationDate { get; private set; }

        public Group(string name, int companyId)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.CompanyId = companyId;
            this.CreationDate = DateTime.UtcNow;
        }
    }
}
