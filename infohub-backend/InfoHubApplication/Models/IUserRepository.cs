using InfoHubApplication.Models;

public interface IUserRepository : IRepository<User>
{
    User FindByEmail(string email);
}
