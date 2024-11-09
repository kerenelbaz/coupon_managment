using System;
using CouponsManagement.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CouponsManagement.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace CouponsManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class CouponsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CouponsController(ApplicationDbContext context)
        {
            _context = context;

        }

        [HttpGet("Coupons")]
        public async Task<IActionResult> GetAllCoupons()
        {
            var sessionAdmin = HttpContext.Session.GetString("Username");
            if (string.IsNullOrEmpty(sessionAdmin))
                return Unauthorized("Please login with admin credential first");

            var coupons = await _context.Coupons.ToListAsync();
            return Ok(coupons);
        }

       
        [HttpPut("CreateCoupon")]
        public async Task<IActionResult> CreateCoupon([FromBody] CreateCoupon req)
        {
            var sessionAdmin = HttpContext.Session.GetString("Username");
            if (string.IsNullOrEmpty(sessionAdmin))
                return Unauthorized("Please login with admin credential first");


            Admin adminUser = _context.Admins.SingleOrDefault(a => a.Username == sessionAdmin);
            if (adminUser == null)
                return Unauthorized("Admin not found");

            var existingCoupon = await _context.Coupons.SingleOrDefaultAsync(
                c => c.Code == req.Code);
            if (existingCoupon != null)
                return BadRequest("Coupon code already exist in the system");

            var newCoupon = new Coupon
            {
                Code = req.Code,
                IsDoublePromotions = req.IsDoublePromotions,
                Description = req.Description,
                AdminId = adminUser.AdminId,
                IsPercentageDiscount = req.IsPercentageDiscount,
                Discount = req.Discount,
                ExpirationDate = req.ExpirationDate,
                MaxUsage = req.MaxUsage

            };

            _context.Coupons.Add(newCoupon);
            await _context.SaveChangesAsync();

            return Ok("Created new coupon successfuly!");
        }

        [HttpPatch("{couponId:int}")]
        public IActionResult EditCoupon(int couponId, [FromBody] EditCoupon req)
        {
            var sessionAdmin = HttpContext.Session.GetString("Username");
            if (string.IsNullOrEmpty(sessionAdmin))
                return Unauthorized("Please login with admin credential first");


            var couponEdit = _context.Coupons.SingleOrDefault(c =>
            c.CouponId == couponId);
            if (couponEdit == null)
                return BadRequest("Coupon not found");

            // Check update coupon code uniqness 
            if (!String.IsNullOrEmpty(req.Code) && req.Code != couponEdit.Code)
            {
                var existingCouponCode = _context.Coupons.SingleOrDefault(c => c.Code == req.Code);
                if (existingCouponCode != null)
                    return BadRequest("Coupon code already exists in the system.");
                couponEdit.Code = req.Code;
            }


            if (req.IsDoublePromotions.HasValue)
                couponEdit.IsDoublePromotions = req.IsDoublePromotions.Value;

            if (!String.IsNullOrEmpty(req.Description))
                couponEdit.Description = req.Description;

            if (req.IsPercentageDiscount.HasValue)
                couponEdit.IsPercentageDiscount = req.IsPercentageDiscount.Value;

            if (req.Discount.HasValue)
                couponEdit.Discount = req.Discount.Value;

            if (req.ExpirationDate.HasValue)
                couponEdit.ExpirationDate = req.ExpirationDate.Value;

            if (req.MaxUsage.HasValue)
                couponEdit.MaxUsage = req.MaxUsage.Value;

            _context.Update(couponEdit);
            _context.SaveChanges();
            return Ok("Coupon updated successfully!");
        }

        [HttpDelete("{couponId:int}")]
        public IActionResult DeleteCoupon(int couponId)
        {
            // Checking if admin is logged in
            var sessionAdmin = HttpContext.Session.GetString("Username");
            if (string.IsNullOrEmpty(sessionAdmin))
                return Unauthorized("Please login with admin credential first");

            var coupon = _context.Coupons.SingleOrDefault(c =>
            c.CouponId == couponId);
            if (coupon == null)
                return BadRequest("Coupon not found");

            _context.Coupons.Remove(coupon);
            _context.SaveChanges();
            return Ok("Coupon deleted");
        }

        //private static double price = 100;

        [HttpPost("apply-coupon")]
        public async Task<IActionResult> ApplyCoupons([FromBody] string couponCode)
        {

            double price;
            var sessionPrice = HttpContext.Session.GetString("price");
            
            if (string.IsNullOrEmpty(sessionPrice)) 
            {
                price = 100;
                HttpContext.Session.SetString("price", price.ToString());
            }
            else {
                price = Convert.ToDouble(sessionPrice);
            }
            double finalPrice = price;

            // check coupon code validation
            var coupon = await _context.Coupons.SingleOrDefaultAsync(c => c.Code == couponCode);
            if (coupon == null || coupon.ExpirationDate<DateTime.Now)
                return BadRequest("Invalid or expired coupon code.");

            
            //check coupon usage
            if (coupon.MaxUsage.HasValue && coupon.MaxUsage > 0)
            {
                coupon.MaxUsage--;
                _context.Update(coupon);
                await _context.SaveChangesAsync();
            }
            else if (coupon.MaxUsage.HasValue && coupon.MaxUsage <= 0)
                return BadRequest("Coupon code used the max usage");



            if (coupon.IsPercentageDiscount)
                finalPrice -= ((finalPrice * coupon.Discount) / 100);
            else finalPrice -= coupon.Discount;
            
            HttpContext.Session.SetString("price", finalPrice.ToString());

            return Ok($"Price after discount is:{finalPrice}");
        }


        [HttpGet("CheckSessionPrice")]
        public IActionResult GetCurrentPriceSession()
        {
            var sessionPrice = HttpContext.Session.GetString("price");
            if (string.IsNullOrEmpty(sessionPrice))
                return Unauthorized("No price saved in session");
            return Ok($"session price is: {sessionPrice}");
        }


    }

    

   
}

