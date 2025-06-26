using InfoHubApplication.Models;

namespace InfoHubApplication.Infrastructure
{
    public class EnterpriseRepository : IRepository<Enterprise>
    {
        private readonly DbConnectionContext _context = new DbConnectionContext();

        public void Add(Enterprise enterprise)
        {
            _context.Enterprises.Add(enterprise);
            _context.SaveChanges();
        }

        public List<Enterprise> Get()
        {
            return _context.Enterprises.ToList();
        }
    }
}
