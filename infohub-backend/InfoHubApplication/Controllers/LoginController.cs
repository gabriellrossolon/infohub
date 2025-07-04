using InfoHubApplication.Models;
using InfoHubApplication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace InfoHubApplication.Controllers
{
    [ApiController]
    [Route("api/v1/login")]
    public class LoginController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public LoginController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginViewModel loginData)
        {
            if (loginData == null || string.IsNullOrEmpty(loginData.Email) || string.IsNullOrEmpty(loginData.Password))
            {
                return BadRequest("Dados de login inválidos");
            }

            var user = _userRepository.FindByEmail(loginData.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Usuário ou senha incorretos." });
            }

            if (!VerifyPassword(loginData.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Usuário ou senha incorretos." });
            }

            var token = TokenService.GenerateToken(user);

            return Ok(new
            {
                token = token,  // token é string aqui
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    companyId = user.CompanyId
                }
            });
        }
        private bool VerifyPassword(string plainPassword, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, hashedPassword);
        }

    }
}
