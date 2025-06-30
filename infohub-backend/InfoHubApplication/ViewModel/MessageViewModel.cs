using System.ComponentModel.DataAnnotations;

namespace InfoHubApplication.ViewModel
{
    public class MessageViewModel
    {
        [Required]
        public int GroupId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public string MessageCategory { get; set; }
        [Required]
        public string MessageContent { get; set; }
    }
}
