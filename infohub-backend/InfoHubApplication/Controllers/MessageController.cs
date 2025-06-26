using InfoHubApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace InfoHubApplication.Controllers
{
    [ApiController]
    [Route("api/v1/message")]
    public class MessageController : ControllerBase
    {
        private readonly IRepository<Message> _messageRepository;

        public MessageController(IRepository<Message> messageRepository)
        {
            _messageRepository = messageRepository;
        }

        [HttpPost]
        public IActionResult Add([FromBody] Message messageInput)
        {
            if (messageInput == null)
            {
                return BadRequest("Message data is null");
            }

            var message = new Message(messageInput.GroupId, messageInput.UserId, messageInput.MessageCategory, messageInput.MessageContent, messageInput.SendTime);

            _messageRepository.Add(message);

            return Ok();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var messages = _messageRepository.Get();
            return Ok(messages);
        }

    }
}
