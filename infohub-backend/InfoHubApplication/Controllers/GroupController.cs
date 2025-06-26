using InfoHubApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace InfoHubApplication.Controllers
{
    [ApiController]
    [Route("api/v1/group")]
    public class GroupController : ControllerBase
    {
        private readonly IRepository<Group> _groupRepository;

        public GroupController(IRepository<Group> groupRepository)
        {
            _groupRepository = groupRepository;
        }

        [HttpPost]
        public IActionResult Add([FromBody] Group groupInput)
        {
            if (groupInput == null)
            {
                return BadRequest("Group data is null");
            }

            var group = new Group(groupInput.Name, groupInput.EnterpriseId, groupInput.CreationDate);

            _groupRepository.Add(group);

            return Ok();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var groups = _groupRepository.Get();
            return Ok(groups);
        }
    }
}
