namespace InfoHubApplication.Models
{
    public interface IRepository<T>
    {
        void Add(T entity);
        void Remove(T entity);
        List<T> Get();
        T FindById(int id);
    }
}
