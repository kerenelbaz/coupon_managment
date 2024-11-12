using Microsoft.EntityFrameworkCore;
using CouponsManagement.Data;
using System;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("https://coupon-management-gf1k.vercel.app").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
        });
});

// Add services to the container.

builder.Services.AddControllers();


// memory cache to support the sessions
// builder.Services.AddDistributedMemoryCache();
builder.Services.AddDistributedMemoryCache(); 

// configure session with 30 minutes
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.None; 
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; 
});
builder.Services.AddControllersWithViews();

builder.Services.AddSession();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseMySql(builder.Configuration
.GetConnectionString("Default"), new MySqlServerVersion(new Version(8, 0, 21))));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}




app.UseCors(MyAllowSpecificOrigins);

app.UseSession();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();


