using InfoHubApplication.Models;

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
        public void Remove(User user)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
        public List<User> Get()
        {
            return _context.Users.ToList();
        }

        public User FindById(int id)
        {
            return _context.Set<User>().Find(id);
        }

        public User FindByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }
    }
}
