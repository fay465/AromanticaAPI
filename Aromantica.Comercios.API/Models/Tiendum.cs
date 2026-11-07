using System;
using System.Collections.Generic;

namespace Aromantica.Comercios.API.Models;

public partial class Tiendum
{
    public int IdTienda { get; set; }

    public string NombreComercial { get; set; } = null!;

    public string TipoComercio { get; set; } = null!;

    public string SitioWebBase { get; set; } = null!;

    public string? LogoUrl { get; set; }

    public bool Activo { get; set; }
}
