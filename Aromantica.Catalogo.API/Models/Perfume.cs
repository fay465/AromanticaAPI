using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Aromantica.Catalogo.API.Models;

public partial class Perfume
{
    public int IdPerfume { get; set; }

    public string Nombre { get; set; } = null!;

    public int IdMarca { get; set; }

    public string Concentracion { get; set; } = null!;

    public string Genero { get; set; } = null!;

    public string FamiliaOlfativa { get; set; } = null!;

    public string AcordesPredominantes { get; set; } = null!;

    public string NotasSalida { get; set; } = null!;

    public string NotasCorazon { get; set; } = null!;

    public string NotasFondo { get; set; } = null!;

    public string Duracion { get; set; } = null!;

    public string Estela { get; set; } = null!;

    public string? ImagenUrl { get; set; }

    [JsonIgnore]
    public virtual Marca? IdMarcaNavigation { get; set; } = null;
}