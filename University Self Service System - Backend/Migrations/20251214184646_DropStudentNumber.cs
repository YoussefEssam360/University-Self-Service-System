using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace University_Self_Service_System___Backend.Migrations
{
    /// <inheritdoc />
    public partial class DropStudentNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StudentNumber",
                table: "Students");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StudentNumber",
                table: "Students",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
