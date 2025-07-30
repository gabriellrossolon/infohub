using InfoHubApplication.Models;

public interface IGroupRepository : IRepository<Group>
{
    void Update(Group group);
}
