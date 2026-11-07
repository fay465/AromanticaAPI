using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aromantica.Cotizaciones.API.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OfertaPrecio",
                columns: table => new
                {
                    id_oferta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_perfume = table.Column<int>(type: "int", nullable: false),
                    id_tienda = table.Column<int>(type: "int", nullable: false),
                    precio_clp = table.Column<int>(type: "int", nullable: false),
                    formato_ml = table.Column<int>(type: "int", nullable: false),
                    stock_disponible = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    url_compra = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
                    fecha_actualizacion = table.Column<DateOnly>(type: "date", nullable: false, defaultValueSql: "(CONVERT([date],getdate()))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OfertaPr__2B7BF92F2E643770", x => x.id_oferta);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OfertaPrecio");
        }
    }
}
