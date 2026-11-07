using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Aromantica.Catalogo.API.Models;

public partial class Marca
{
    public int IdMarca { get; set; }

    public string Nombre { get; set; } = null!;

    public string PaisOrigen { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Perfume> Perfumes { get; set; } = new List<Perfume>();
}