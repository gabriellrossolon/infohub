using System.ComponentModel.DataAnnotations;

namespace InfoHubApplication.ViewModel
{
    public class GroupViewModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int EnterpriseId { get; set; }
    }
}
