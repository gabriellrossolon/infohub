using InfoHubApplication.Infrastructure;
using InfoHubApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace InfoHubApplication.Controllers
{
    [ApiController]
    [Route("api/v1/company")]
    public class CompanyController : ControllerBase
    {
        private readonly IRepository<Company> _companyRepository;

        public CompanyController(IRepository<Company> companyRepository)
        {
            _companyRepository = companyRepository;
        }

        [HttpPost]
        public IActionResult Add([FromBody] Company companyInput)
        {
            if (companyInput == null)
            {
                return BadRequest("Company data is null");
            }

            var company = new Company(companyInput.Name);

            _companyRepository.Add(company);

            return Ok();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var companies = _companyRepository.Get();
            return Ok(companies);
        }
    }
}