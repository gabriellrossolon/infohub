using InfoHubApplication.Constants;
using InfoHubApplication.Infrastructure;
using InfoHubApplication.Models;
using InfoHubApplication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;

namespace InfoHubApplication.Controllers
{
    [ApiController]
    [Route("api/v1/user")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [Authorize(Roles = "admin,manager")]
        [HttpPost]
        public IActionResult Add([FromBody] UserViewModel userViewModel)
        {
            if (userViewModel == null)
            {
                return BadRequest("User data is null");
            }

            var existingUser = _userRepository.FindByEmail(userViewModel.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "Já existe um usuário com esse Email!" });
            }



            // Regras de validação de Role e Company ->
            var validRoles = new[] { Roles.User, Roles.Manager, Roles.Admin };
            if (!validRoles.Contains(userViewModel.Role))
            {
                return BadRequest("Role inválida.");
            }
            var currentUserRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var currentUserCompanyId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "companyId")?.Value ?? "0");

            if (string.IsNullOrEmpty(currentUserRole))
            {
                return Unauthorized("Usuário não autenticado corretamente.");
            }
            // Regras de permissão específicas:
            if (currentUserRole == Roles.Admin)
            {

            }
            else if (currentUserRole == Roles.Manager)
            {
                if (userViewModel.CompanyId != currentUserCompanyId)
                {
                    return StatusCode(403, new { message = "Managers só podem criar Usuários dentro da própria empresa." });
                }

                if (userViewModel.Role == Roles.Admin)
                {
                    return StatusCode(403, new { message = "Managers não podem criar usuários com role admin." });
                }
            }
            else
            {
                return StatusCode(403, new { message = "Usuários não possuem permissão para criar outros usuários." });
            }


            var user = new User(userViewModel.Name, userViewModel.Email, userViewModel.Password, userViewModel.Role, userViewModel.CompanyId);

            _userRepository.Add(user);

            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role,
                companyId = user.CompanyId,
            });
        }


        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult Get()
        {
            var users = _userRepository.Get();
            return Ok(users);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var user = _userRepository.FindById(id);
            if (user == null)
            {
                return NotFound(new { message = "User não encontrado." });
            }
            return Ok(user);
        }
    }
}
