﻿using InfoHubApplication.Models;

namespace InfoHubApplication.Infrastructure
{
    public class CompanyRepository : IRepository<Company>
    {
        private readonly DbConnectionContext _context = new DbConnectionContext();

        public void Add(Company company)
        {
            _context.Companies.Add(company);
            _context.SaveChanges();
        }

        public void Remove(Company company)
        {
            _context.Companies.Remove(company);
            _context.SaveChanges();
        }

        public List<Company> Get()
        {
            return _context.Companies.ToList();
        }

        public Company FindById(int id)
        {
            return _context.Set<Company>().Find(id);
        }
    }
}
