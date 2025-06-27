using InfoHubApplication.Models;
using System.Linq;

namespace InfoHubApplication.Infrastructure
{
    public class UserRepository : IUserRepository
    {
        private readonly DbConnectionContext _context = new DbConnectionContext();

        public void Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public List<User> Get()
        {
            return _context.Users.ToList();
        }

        public User FindByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }
    }
}
