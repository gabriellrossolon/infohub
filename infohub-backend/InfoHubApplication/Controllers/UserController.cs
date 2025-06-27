using Microsoft.AspNetCore.Mvc;
using InfoHubApplication.Models;

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

        [HttpPost]
        public IActionResult Add([FromBody] UserViewModel userInput)
        {
            if(userInput == null)
            {
                return BadRequest("User data is null");
            }

            var existingUser = _userRepository.FindByEmail(userInput.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "Já existe um usuário com esse Email!" });
            }

            var user = new User(userInput.Name, userInput.Email, userInput.Password, userInput.Role);

            _userRepository.Add(user);

            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role
            });
        }

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

            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role
            });
        }
        private bool VerifyPassword(string plainPassword, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, hashedPassword);
        }

    }
}
