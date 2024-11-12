using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CouponsManagement.Models;
using CouponsManagement.Data;

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

        /// <summary>
        /// Register to a new admin user - required admin logged in 
        /// </summary>
        /// <param name="req">request body contains the new dmin's username and password</param>
        /// <returns>JSON based message success or error messages</returns>
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            var username = HttpContext.Session.GetString("Username");
            if (username == null || username == "")
            {
                return Unauthorized(new{message = "Only connected admin allow to create user."});
            }

            var existAdmin = await _context.Admins.SingleOrDefaultAsync(admin => admin.Username == req.Username);

            if (existAdmin != null)
                return BadRequest(new { message = "Admin's username already exists." });

            var newAdmin = new Admin
            {
                Username = req.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };

            _context.Admins.Add(newAdmin);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Created new admin successfuly." });

        }

        /// <summary>
        /// Login to an admin account and save the admin logged-in to the sassion
        /// </summary>
        /// <param name="req">request body contain username and password</param>
        /// <returns>JSON based message success or error messages</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var adminUser = await _context.Admins.SingleOrDefaultAsync(admin => admin.Username == req.Username);
            if (adminUser == null || !BCrypt.Net.BCrypt.Verify(req.Password, adminUser.Password))
                return Unauthorized(new { message = "Invalid username or password" });

            HttpContext.Session.SetString("Username", adminUser.Username); // save the logged admin in the session

            return Ok(new { message = "Loggin successful!" });


        }

        /// <summary>
        /// Test API for checking session saved the current admin logged
        /// </summary>
        [NonAction]
        [HttpGet("CheckSessionAdmin")]
        public IActionResult GetCurrentUser()
        {
            var username = HttpContext.Session.GetString("Username");

            if (username == null || username == "")
            {
                return Unauthorized(new { message = "No user is logged in." });
            }

            return Ok(new { Username = username });
        }

        /// <summary>
        /// Logout the current logged in admin user and clear the session
        /// </summary>
        /// <returns>JSON based message success or error messages</returns>
        [HttpPost("Logout")]
        public IActionResult Logout() {

            var username = HttpContext.Session.GetString("Username");

            if (username == null || username=="")
            {
                return Unauthorized(new { message = "No user is logged in." });
            }
            HttpContext.Session.Clear();

            return Ok(new { message = "User logged out successfuly" });
        }

    }
}

