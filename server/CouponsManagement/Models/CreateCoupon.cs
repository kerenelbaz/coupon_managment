﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CouponsManagement.Models
{
    public class CreateCoupon
    {
        public CreateCoupon()
        {
        }
        public string Code { get; set; }
        public bool IsDoublePromotions { get; set; }
        public string Description { get; set; }
        public bool IsPercentageDiscount { get; set; }
        public double Discount { get; set; }
        public DateTime? ExpirationDate { get; set; } // null value means no experation
        public int? MaxUsage { get; set; }
    }
}

