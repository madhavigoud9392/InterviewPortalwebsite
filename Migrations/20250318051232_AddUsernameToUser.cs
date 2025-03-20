using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InterviewPreparationPortal.Migrations
{
    /// <inheritdoc />
    public partial class AddUsernameToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "QuestionBanks",
                newName: "Question");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "QuestionBanks",
                newName: "Category");

            migrationBuilder.RenameColumn(
                name: "InterviewerName",
                table: "MockInterviews",
                newName: "Interviewer");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Users",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Answer",
                table: "QuestionBanks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "MockInterviews",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Answer",
                table: "QuestionBanks");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "MockInterviews");

            migrationBuilder.RenameColumn(
                name: "Question",
                table: "QuestionBanks",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "Category",
                table: "QuestionBanks",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "Interviewer",
                table: "MockInterviews",
                newName: "InterviewerName");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);
        }
    }
}
