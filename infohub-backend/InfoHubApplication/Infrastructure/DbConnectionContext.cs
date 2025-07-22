using Microsoft.EntityFrameworkCore;
using InfoHubApplication.Models;

namespace InfoHubApplication.Infrastructure
{
    public class DbConnectionContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Group)
                .WithMany(g => g.Messages)
                .HasForeignKey(m => m.GroupId)
                .OnDelete(DeleteBehavior.Cascade); // 👈 Isso é o que habilita a deleção em cascata
        }

    }
}
