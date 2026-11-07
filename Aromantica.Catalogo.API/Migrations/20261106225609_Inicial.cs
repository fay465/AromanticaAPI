using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aromantica.Catalogo.API.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Marca",
                columns: table => new
                {
                    id_marca = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "varchar(120)", unicode: false, maxLength: 120, nullable: false),
                    pais_origen = table.Column<string>(type: "varchar(80)", unicode: false, maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Marca__7E43E99EACEE574F", x => x.id_marca);
                });

            migrationBuilder.CreateTable(
                name: "Perfume",
                columns: table => new
                {
                    id_perfume = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    id_marca = table.Column<int>(type: "int", nullable: false),
                    concentracion = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    genero = table.Column<string>(type: "varchar(40)", unicode: false, maxLength: 40, nullable: false),
                    familia_olfativa = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    acordes_predominantes = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: false),
                    notas_salida = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: false),
                    notas_corazon = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: false),
                    notas_fondo = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: false),
                    duracion = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false),
                    estela = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false),
                    imagen_url = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Perfume__97782D34AD4AD410", x => x.id_perfume);
                    table.ForeignKey(
                        name: "FK_Perfume_Marca",
                        column: x => x.id_marca,
                        principalTable: "Marca",
                        principalColumn: "id_marca");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Perfume_id_marca",
                table: "Perfume",
                column: "id_marca");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Perfume");

            migrationBuilder.DropTable(
                name: "Marca");
        }
    }
}
