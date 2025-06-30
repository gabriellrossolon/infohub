using InfoHubApplication.Services;
using Microsoft.AspNetCore.Mvc;

namespace InfoHubApplication.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : Controller
    {
        [HttpPost]
        public IActionResult Auth(string userName, string password)
        {
            if(userName == "gabriell" && password == "123")
            {
                var token = TokenService.GenerateToken(new Models.User());
                return Ok(token);
            }

            return BadRequest("username or password invalid");
        }
    }
}
