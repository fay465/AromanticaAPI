using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Aromantica.Comercios.API.Models;

public partial class ComerciosDbContext : DbContext
{
    public ComerciosDbContext()
    {
    }

    public ComerciosDbContext(DbContextOptions<ComerciosDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Tiendum> Tienda { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tiendum>(entity =>
        {
            entity.HasKey(e => e.IdTienda).HasName("PK__Tienda__7C49D736D87FAEA9");

            entity.Property(e => e.IdTienda).HasColumnName("id_tienda");
            entity.Property(e => e.Activo)
                .HasDefaultValue(true)
                .HasColumnName("activo");
            entity.Property(e => e.LogoUrl)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("logo_url");
            entity.Property(e => e.NombreComercial)
                .HasMaxLength(120)
                .IsUnicode(false)
                .HasColumnName("nombre_comercial");
            entity.Property(e => e.SitioWebBase)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("sitio_web_base");
            entity.Property(e => e.TipoComercio)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("tipo_comercio");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
