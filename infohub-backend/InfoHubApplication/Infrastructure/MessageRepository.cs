using InfoHubApplication.Models;

namespace InfoHubApplication.Infrastructure
{
    public class MessageRepository : IRepository<Message>
    {
        private readonly DbConnectionContext _context = new DbConnectionContext();

        public void Add(Message message)
        {
            _context.Messages.Add(message);
            _context.SaveChanges();
        }

        public List<Message> Get()
        {
            return _context.Messages.ToList();
        }
    }
}
