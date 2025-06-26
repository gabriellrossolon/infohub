using Microsoft.AspNetCore.Mvc;
using InfoHubApplication.Models;

namespace InfoHubApplication.Controllers
{
    [ApiController]
    [Route("api/v1/user")]
    public class UserController : ControllerBase
    {
        private readonly IRepository<User> _userRepository;

        public UserController(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost]
        public IActionResult Add([FromBody] User userInput)
        {
            if(userInput == null)
            {
                return BadRequest("User data is null");
            }

            var user = new User(userInput.Name, userInput.Email, userInput.Password, userInput.Role);

            _userRepository.Add(user);

            return Ok();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var users = _userRepository.Get();
            return Ok(users);
        }
        
    }
}
