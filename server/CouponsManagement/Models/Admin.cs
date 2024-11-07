﻿using System;
using System.ComponentModel.DataAnnotations;

namespace CouponsManagement.Models
{
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}

