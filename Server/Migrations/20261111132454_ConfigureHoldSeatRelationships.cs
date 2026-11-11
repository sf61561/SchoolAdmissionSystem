using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureHoldSeatRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoldSeats_Users_UsersId",
                table: "HoldSeats");

            migrationBuilder.DropIndex(
                name: "IX_HoldSeats_UsersId",
                table: "HoldSeats");

            migrationBuilder.DropIndex(
                name: "IX_Classes_Name",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "UsersId",
                table: "HoldSeats");

            migrationBuilder.AlterColumn<int>(
                name: "ClassId",
                table: "HoldSeats",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            
            migrationBuilder.CreateIndex(
                name: "IX_HoldSeats_ClassId",
                table: "HoldSeats",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_HoldSeats_StudentId",
                table: "HoldSeats",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_HoldSeats_Classes_ClassId",
                table: "HoldSeats",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HoldSeats_Users_StudentId",
                table: "HoldSeats",
                column: "StudentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoldSeats_Classes_ClassId",
                table: "HoldSeats");

            migrationBuilder.DropForeignKey(
                name: "FK_HoldSeats_Users_StudentId",
                table: "HoldSeats");

            migrationBuilder.DropIndex(
                name: "IX_HoldSeats_ClassId",
                table: "HoldSeats");

            migrationBuilder.DropIndex(
                name: "IX_HoldSeats_StudentId",
                table: "HoldSeats");

            

            migrationBuilder.AddColumn<string>(
                name: "UsersId",
                table: "HoldSeats",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Classes",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn)
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.CreateIndex(
                name: "IX_HoldSeats_UsersId",
                table: "HoldSeats",
                column: "UsersId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_Name",
                table: "Classes",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_HoldSeats_Users_UsersId",
                table: "HoldSeats",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
