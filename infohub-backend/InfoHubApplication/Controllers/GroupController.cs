using InfoHubApplication.Models;
using InfoHubApplication.ViewModel;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
        [HttpPost]
        public IActionResult Add([FromBody] GroupViewModel groupViewModel)
        {
            if (groupViewModel == null)
            {
                return BadRequest("Group data is null");
            }

            // Aqui assumindo que o Group tem CompanyId (e não EnterpriseId)
            var group = new Group(groupViewModel.Name, groupViewModel.CompanyId);

            _groupRepository.Add(group);

            return Ok();
        }

        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            var groups = _groupRepository.Get();
            return Ok(groups);
        }

        [Authorize]
        [HttpGet("my-groups")]
        public IActionResult GetMyGroups()
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId")?.Value;

            if (string.IsNullOrEmpty(companyIdClaim) || !int.TryParse(companyIdClaim, out int companyId))
            {
                return Unauthorized("Company ID inválido no token.");
            }

            var groups = _groupRepository
                .Get()
                .Where(g => g.CompanyId == companyId)
                .ToList();

            return Ok(groups);
        }
    }

}