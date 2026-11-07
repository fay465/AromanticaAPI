using System;
using System.Collections.Generic;

namespace Aromantica.Cotizaciones.API.Models;

public partial class OfertaPrecio
{
    public int IdOferta { get; set; }

    public int IdPerfume { get; set; }

    public int IdTienda { get; set; }

    public int PrecioClp { get; set; }

    public int FormatoMl { get; set; }

    public bool StockDisponible { get; set; }

    public string UrlCompra { get; set; } = null!;

    public DateOnly FechaActualizacion { get; set; }
}
