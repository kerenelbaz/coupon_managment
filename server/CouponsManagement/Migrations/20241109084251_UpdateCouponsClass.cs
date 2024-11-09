using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CouponsManagement.Migrations
{
    public partial class UpdateCouponsClass : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Coupons_Admins_AdminId",
                table: "Coupons");

            migrationBuilder.DropIndex(
                name: "IX_Coupons_AdminId",
                table: "Coupons");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Coupons_AdminId",
                table: "Coupons",
                column: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Coupons_Admins_AdminId",
                table: "Coupons",
                column: "AdminId",
                principalTable: "Admins",
                principalColumn: "AdminId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
