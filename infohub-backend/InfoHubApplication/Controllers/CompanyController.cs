using InfoHubApplication.Infrastructure;
using InfoHubApplication.Models;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
        [HttpPost]
        public IActionResult Add([FromBody] CompanyViewModel companyViewModel)
        {
            if (companyViewModel == null)
            {
                return BadRequest("Company data is null");
            }

            var company = new Company(companyViewModel.Name);

            _companyRepository.Add(company);

            return Ok();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id:int}")]
        public IActionResult Remove(int id)
        {
            var company = _companyRepository.FindById(id);
            if (company == null)
            {
                return NotFound(new { message = "Compania não encontrada" });
            }

            _companyRepository.Remove(company);
            return NoContent();
        }

        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            var companies = _companyRepository.Get();
            return Ok(companies);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var company = _companyRepository.FindById(id);
            if (company == null)
            {
                return NotFound(new { message = "Empresa não encontrada." });
            }
            return Ok(company);
        }
    }
}