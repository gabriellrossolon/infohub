using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfoHubApplication.Models
{
    [Table("messages")]
    public class Message
    {
        [Key]
        public int Id { get; private set; }
        public int GroupId { get; private set; }
        public int UserId { get; private set; }
        public string MessageCategory { get; private set; }
        public string MessageContent { get; private set; }
        public DateTime SendTime { get; private set; }

        public Message(int groupId, int userId, string messageCategory, string messageContent)
        {
            this.GroupId = groupId;
            this.UserId = userId;
            this.MessageCategory = messageCategory;
            this.MessageContent = messageContent;
            this.SendTime = DateTime.UtcNow;
        }
    }
}
