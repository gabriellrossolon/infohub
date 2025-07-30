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
        private readonly IGroupRepository _groupRepository;

        public GroupController(IGroupRepository groupRepository)
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

            var cleanedIdentifier = System.Text.RegularExpressions.Regex.Replace(groupViewModel.IdentifierValue ?? "", @"\D", "");

            var group = new Group(
                groupViewModel.Name,
                groupViewModel.CompanyId,
                groupViewModel.IdentifierType,
                cleanedIdentifier
            );

            _groupRepository.Add(group);

            return Ok();
        }

        [Authorize(Roles = "admin,manager")]
        [HttpDelete("{id:int}")]
        public IActionResult Remove(int id)
        {
            var group = _groupRepository.FindById(id);
            if (group == null)
            {
                return NotFound(new { message = "Grupo não encontrado." });
            }

            _groupRepository.Remove(group);
            return NoContent();
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

        [Authorize]
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var group = _groupRepository.FindById(id);
            if (group == null)
            {
                return NotFound(new { message = "Grupo não encontrado." });
            }
            return Ok(group);
        }
    }

}
