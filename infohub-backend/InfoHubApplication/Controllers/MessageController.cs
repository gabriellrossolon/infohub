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
        private readonly IGroupRepository _groupRepository;

        public MessageController(
            IRepository<Message> messageRepository,
            IGroupRepository groupRepository)
        {
            _messageRepository = messageRepository;
            _groupRepository = groupRepository;
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

            var group = _groupRepository.FindById(message.GroupId);
            if (group != null)
            {
                group.LastMessageTimestamp = message.SendTime;
                _groupRepository.Update(group);
            }

            return Ok();
        }

        [Authorize(Roles = "admin,manager")]
        [HttpDelete("{id:int}")]
        public IActionResult Remove(int id)
        {
            var message = _messageRepository.FindById(id);
            if (message == null)
            {
                return NotFound(new { message = "Mensagem não encontrada." });
            }

            _messageRepository.Remove(message);
            return NoContent();
        }

        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            var messages = _messageRepository.Get();
            return Ok(messages);
        }

        [Authorize]
        [HttpGet("group/{groupId:int}")]
        public IActionResult GetMessagesByGroupId(int groupId)
        {
            var messages = _messageRepository
                .Get()
                .Where(m => m.GroupId == groupId)
                .OrderByDescending(m => m.SendTime)
                .ToList();

            return Ok(messages);
        }
    }
}
