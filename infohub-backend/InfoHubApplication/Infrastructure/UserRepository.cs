using InfoHubApplication.Models;

namespace InfoHubApplication.Infrastructure
{
    public class UserRepository : IRepository<User>
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
    }
}
