using System;
using CouponsManagement.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CouponsManagement.Models;
using System.Data;
using ClosedXML.Excel;

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

            //reload the full coupon object in order to return it
            var createdCoupon = await _context.Coupons
                .Where(c => c.CouponId == newCoupon.CouponId)
                .FirstOrDefaultAsync();

            return Ok(createdCoupon);
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

            //check if coupon code has no double promotion
            string doublePromotionFlag = HttpContext.Session.GetString("DoublePromotion");
            if (doublePromotionFlag == "false")
                return BadRequest("You used a non double promotion code beforeת can't use this code now.");

            if (!coupon.IsDoublePromotions) //saving to the session in case the current coupon is not allow double promotion
            {
                HttpContext.Session.SetString("DoublePromotion", "false");
            }

            if (coupon.IsPercentageDiscount)
                finalPrice -= ((finalPrice * coupon.Discount) / 100);
            else finalPrice -= coupon.Discount;

            if (finalPrice <= 0)
                return BadRequest("You reached the minimum discounted price");

            HttpContext.Session.SetString("price", finalPrice.ToString());

            //return Ok($"Price after discount is:{finalPrice}");
            return Ok(new { finalPrice = finalPrice });

        }


        [HttpGet("CheckSessionPrice")]
        public IActionResult GetCurrentPriceSession()
        {
            var sessionPrice = HttpContext.Session.GetString("price");
            if (string.IsNullOrEmpty(sessionPrice))
                return Unauthorized("No price saved in session");
            return Ok($"session price is: {sessionPrice}");
        }


        [HttpGet("CouponByAdmin/{username}")]
        public async Task<IActionResult> GetCouponsByCreatedAdmin(string username)
        {
            // Checking if admin is logged in
            var sessionAdmin = HttpContext.Session.GetString("Username");
            if (string.IsNullOrEmpty(sessionAdmin))
                return Unauthorized("Please login with admin credential first");

            //find admin by username
            var admin = await _context.Admins.SingleOrDefaultAsync(a => a.Username == username);
            if (admin == null) return NotFound("Admin not found");

            //get all coupons created by specific admin
            var coupons = await _context.Coupons.Where(c => c.AdminId == admin.AdminId).ToListAsync();
            if (coupons == null || coupons.Count == 0)
            {
                return BadRequest("Admin didn't create coupons yet.");
            }
            return Ok(coupons);
            
        }

        [HttpGet("dateRange")]
        public async Task <IActionResult> GetCouponsByDateRange(string d1, string d2)
        {
            // Checking if admin is logged in
            var sessionAdmin = HttpContext.Session.GetString("Username");
            if (string.IsNullOrEmpty(sessionAdmin))
                return Unauthorized("Please login with admin credential first");

            
            DateTime startDate = DateTime.Parse(d1);
            DateTime endDate = DateTime.Parse(d2);

            if (d1 == null || d2 == null)
                return BadRequest("Oops, invalid date. insert dates in the format dd-MM-yyyy");

            var coupons = await _context.Coupons.Where(c => c.CreatedDate.Date >=
            startDate && c.CreatedDate.Date <= endDate).ToListAsync();

            if (!coupons.Any()) return NotFound("No coupons found during date range");
            

            return (Ok(coupons));


        }


        [HttpGet("ExportExcel")]
        public ActionResult ExportExcel()
        {
            var _couponData = GetCouponsData();

            //declare on excel workbook
            using(XLWorkbook wb=new XLWorkbook())
            {
                wb.AddWorksheet(_couponData, "Coupons Records"); //sheet name

                using(MemoryStream ms = new MemoryStream())
                {
                    wb.SaveAs(ms);
                    return File(ms.ToArray(),"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Coupons_Report.xlsx");
                }

            }


        }

        [NonAction]
        private DataTable GetCouponsData() {

            DataTable dt = new DataTable();
            dt.TableName = "Coupons";
            dt.Columns.Add("CouponId", typeof(int));
            dt.Columns.Add("Code", typeof(string));
            dt.Columns.Add("IsDoublePromotions", typeof(bool));
            dt.Columns.Add("AdminId", typeof(int));
            dt.Columns.Add("CreatedDate", typeof(DateTime));
            dt.Columns.Add("IsPercentageDiscount", typeof(bool));
            dt.Columns.Add("Discount", typeof(double));
            dt.Columns.Add("ExpirationDate", typeof(DateTime));
            dt.Columns.Add("MaxUsage", typeof(int));
            dt.Columns.Add("Description", typeof(string));

            var _list = this._context.Coupons.ToList();
            if(_list.Count >0)
            {
                _list.ForEach(item =>
                {
                    dt.Rows.Add(item.CouponId, item.Code, item.IsDoublePromotions,
                        item.AdminId, item.CreatedDate, item.IsPercentageDiscount,
                        item.Discount, item.ExpirationDate, item.MaxUsage, item.Description);
                });
            }    
            return dt;

        }

    }

   
   
}

