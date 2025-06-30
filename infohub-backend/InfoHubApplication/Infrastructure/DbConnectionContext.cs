using Microsoft.EntityFrameworkCore;
using InfoHubApplication.Models;

namespace InfoHubApplication.Infrastructure
{
    public class DbConnectionContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Enterprise> Enterprises { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(
                "server=localhost;" +
                "port=3306;" +
                "database=infohub;" +
                "user=root;" +
                "password=1234",
                new MySqlServerVersion(new Version(8, 0, 42))
            );
        }
    }
}
