using InfoHubApplication.Models;
using InfoHubApplication.ViewModel;
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
        public IActionResult Add([FromBody] GroupViewModel groupViewModel)
        {
            if (groupViewModel == null)
            {
                return BadRequest("Group data is null");
            }

            var group = new Group(groupViewModel.Name, groupViewModel.EnterpriseId);

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
