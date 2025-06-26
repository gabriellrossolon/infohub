namespace InfoHubApplication.Models
{
    public interface IRepository<T>
    {
        void Add(T entity);
        List<T> Get();
    }
}
