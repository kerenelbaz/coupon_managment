using System;
using Microsoft.EntityFrameworkCore;
using CouponsManagement.Models;

namespace CouponsManagement.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Admin> Admins {get;set;}
    }
}

