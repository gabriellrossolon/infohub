using InfoHubApplication.Models;
using InfoHubApplication.ViewModel;
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
        public IActionResult Add([FromBody] MessageViewModel messageViewModel)
        {
            if (messageViewModel == null)
            {
                return BadRequest("Message data is null");
            }

            var message = new Message(messageViewModel.GroupId, messageViewModel.UserId, messageViewModel.MessageCategory, messageViewModel.MessageContent);

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
