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
        public DbSet<Coupon> Coupons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Coupon>().Property(p => p.Code).UseCollation("utf8mb4_bin");
        }
    }
}

