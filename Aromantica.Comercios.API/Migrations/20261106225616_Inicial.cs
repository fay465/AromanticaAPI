using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aromantica.Comercios.API.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tienda",
                columns: table => new
                {
                    id_tienda = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_comercial = table.Column<string>(type: "varchar(120)", unicode: false, maxLength: 120, nullable: false),
                    tipo_comercio = table.Column<string>(type: "varchar(80)", unicode: false, maxLength: 80, nullable: false),
                    sitio_web_base = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: false),
                    logo_url = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Tienda__7C49D736D87FAEA9", x => x.id_tienda);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tienda");
        }
    }
}
