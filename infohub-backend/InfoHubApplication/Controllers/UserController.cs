using InfoHubApplication.Models;
using InfoHubApplication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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
        [Authorize]
        [HttpPost]
        public IActionResult Add([FromForm] UserViewModel userViewModel)
        {
            if(userViewModel == null)
            {
                return BadRequest("User data is null");
            }

            var existingUser = _userRepository.FindByEmail(userViewModel.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "Já existe um usuário com esse Email!" });
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
        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            var users = _userRepository.Get();
            return Ok(users);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginViewModel loginData)
        {
            if(loginData == null || string.IsNullOrEmpty(loginData.Email) || string.IsNullOrEmpty(loginData.Password))
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
