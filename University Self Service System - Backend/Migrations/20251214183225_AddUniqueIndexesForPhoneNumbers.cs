using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace University_Self_Service_System___Backend.Migrations
{
    public partial class AddUniqueIndexesForPhoneNumbers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Students_PhoneNumber",
                table: "Students",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Professors_PhoneNumber",
                table: "Professors",
                column: "PhoneNumber",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Students_PhoneNumber",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Professors_PhoneNumber",
                table: "Professors");
        }
    }
}