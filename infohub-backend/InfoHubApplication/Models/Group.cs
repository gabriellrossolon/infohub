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
        public string Phone { get; private set; }
        public string Email { get; private set; }
        public string Description { get; private set; }
        public int CompanyId {  get; private set; }
        public string IdentifierType { get; private set; }
        public string IdentifierValue { get; private set; }
        public DateTime CreationDate { get; private set; }
        public DateTime? LastMessageTimestamp { get; set; } 


        public Group(string name, string phone, string email, string description, int companyId, string identifierType, string identifierValue)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.Phone = phone;
            this.Email = email;
            this.Description = description;
            this.CompanyId = companyId;
            this.IdentifierType = identifierType;
            this.IdentifierValue = identifierValue;
            this.CreationDate = DateTime.UtcNow;
        }
    }
}