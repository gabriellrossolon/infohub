using System.ComponentModel.DataAnnotations;

namespace InfoHubApplication.ViewModel
{
    public class GroupViewModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public int CompanyId { get; set; }

        [Required]
        public string IdentifierType { get; set; }

        [Required]
        public string IdentifierValue { get; set; }
    }
}
