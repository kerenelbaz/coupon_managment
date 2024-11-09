using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CouponsManagement.Models;
using CouponsManagement.Data;
using Microsoft.AspNetCore.Mvc;

namespace CouponsManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AdminsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;


        public AdminsController(ApplicationDbContext context)
        {
            _context = context;
            
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            var username = HttpContext.Session.GetString("Username");
            if (username == null || username == "")
            {
                return Unauthorized("Only connected admin allow to create user.");
            }

            var existAdmin = await _context.Admins.SingleOrDefaultAsync(admin => admin.Username == req.Username);

            if (existAdmin != null)
                return BadRequest("Admin's username already exists.");

            var newAdmin = new Admin
            {
                Username = req.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };

            _context.Admins.Add(newAdmin);
            await _context.SaveChangesAsync();

            return Ok("Created new admin successfuly.");

        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var adminUser = await _context.Admins.SingleOrDefaultAsync(admin => admin.Username == req.Username);
            if (adminUser == null || !BCrypt.Net.BCrypt.Verify(req.Password, adminUser.Password))
                return Unauthorized("Invalid username or password");

            HttpContext.Session.SetString("Username", adminUser.Username); // save the logged admin in the session

            return Ok("Loggin successful!");


        }

        // api for checking session saved the current admin logged
        [HttpGet("CheckSessionAdmin")]
        public IActionResult GetCurrentUser()
        {
            var username = HttpContext.Session.GetString("Username");

            if (username == null || username == "")
            {
                return Unauthorized("No user is logged in.");
            }

            return Ok(new { Username = username });
        }

        [HttpPost("Logout")]
        public IActionResult Logout() {

            var username = HttpContext.Session.GetString("Username");

            if (username == null || username=="")
            {
                return Unauthorized("No user is logged in.");
            }
            HttpContext.Session.Clear();

            return Ok("User logged out successfuly");
        }

    }
}

