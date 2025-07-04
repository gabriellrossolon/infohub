using InfoHubApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InfoHubApplication.Controllers
{
    [ApiController]
    [Route("api/v1/enterprise")]
    public class EnterpriseController : ControllerBase
    {
        private readonly IRepository<Enterprise> _enterpriseRepository;

        public EnterpriseController(IRepository<Enterprise> enterpriseRepository)
        {
            _enterpriseRepository = enterpriseRepository;
        }
        [Authorize]
        [HttpPost]
        public IActionResult Add([FromBody] EnterpriseViewModel enterpriseViewModel)
        {
            if (enterpriseViewModel == null)
            {
                return BadRequest("Enterprise data is null");
            }

            var enterprise = new Enterprise(enterpriseViewModel.Name, enterpriseViewModel.CompanyId);

            _enterpriseRepository.Add(enterprise);

            return Ok();
        }
        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            var enterprises = _enterpriseRepository.Get();
            return Ok(enterprises);
        }

        [Authorize]
        [HttpGet("my-enterprises")]
        public IActionResult GetMyEnterprises()
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId")?.Value;

            if (string.IsNullOrEmpty(companyIdClaim) || !int.TryParse(companyIdClaim, out int companyId))
            {
                return Unauthorized("Company ID inválido no token.");
            }

            var enterprises = _enterpriseRepository
                .Get()
                .Where(e => e.CompanyId == companyId)
                .ToList();

            return Ok(enterprises);
        }
    }
}
