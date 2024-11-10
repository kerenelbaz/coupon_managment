using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CouponsManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CouponsManagement.Models
{
    [Index(nameof(Code), IsUnique=true)]
    public class Coupon
    {
        [Key]
        public int CouponId { get; set; }
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Code { get; set; }
        public bool IsDoublePromotions { get; set; }

        [ForeignKey("AdminId")]
        public int AdminId { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Required]
        public bool IsPercentageDiscount { get; set; }
        [Required]
        public double Discount { get; set; }
        public DateTime? ExpirationDate { get; set; } // null value means no experation
        public int? MaxUsage { get; set; } // null value means unlimited usage

        [Required]
        public string Description { get; set; }

             
    }
}

