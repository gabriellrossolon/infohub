using InfoHubApplication.Infrastructure;
using InfoHubApplication.Models;
using InfoHubApplication.ViewModel;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize]
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
        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            var messages = _messageRepository.Get();
            return Ok(messages);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var message = _messageRepository.FindById(id);
            if (message == null)
            {
                return NotFound(new { message = "Mensagem não encontrada." });
            }
            return Ok(message);
        }
    }
}
