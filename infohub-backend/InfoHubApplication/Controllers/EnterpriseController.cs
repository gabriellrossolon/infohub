using InfoHubApplication.Models;
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

        [HttpPost]
        public IActionResult Add([FromBody] Enterprise enterpriseInput)
        {
            if (enterpriseInput == null)
            {
                return BadRequest("Enterprise data is null");
            }

            var enterprise = new Enterprise(enterpriseInput.Name, enterpriseInput.CreationDate);

            _enterpriseRepository.Add(enterprise);

            return Ok();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var enterprises = _enterpriseRepository.Get();
            return Ok(enterprises);
        }
    }
}
