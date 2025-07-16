using InfoHubApplication.Models;

namespace InfoHubApplication.Infrastructure
{
    public class GroupRepository : IRepository<Group>
    {
        private readonly DbConnectionContext _context = new DbConnectionContext();

        public void Add(Group group)
        {
            _context.Groups.Add(group);
            _context.SaveChanges();
        }

        public void Remove(Group group)
        {
            _context.Groups.Remove(group);
            _context.SaveChanges();
        }

        public List<Group> Get()
        {
            return _context.Groups.ToList();
        }

        public Group FindById(int id)
        {
            return _context.Set<Group>().Find(id);
        }
    }
}
