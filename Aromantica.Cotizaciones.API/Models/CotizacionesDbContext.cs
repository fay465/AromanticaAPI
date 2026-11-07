using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Aromantica.Cotizaciones.API.Models;

public partial class CotizacionesDbContext : DbContext
{
    public CotizacionesDbContext()
    {
    }

    public CotizacionesDbContext(DbContextOptions<CotizacionesDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<OfertaPrecio> OfertaPrecios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OfertaPrecio>(entity =>
        {
            entity.HasKey(e => e.IdOferta).HasName("PK__OfertaPr__2B7BF92F2E643770");

            entity.ToTable("OfertaPrecio");

            entity.Property(e => e.IdOferta).HasColumnName("id_oferta");
            entity.Property(e => e.FechaActualizacion)
                .HasDefaultValueSql("(CONVERT([date],getdate()))")
                .HasColumnName("fecha_actualizacion");
            entity.Property(e => e.FormatoMl).HasColumnName("formato_ml");
            entity.Property(e => e.IdPerfume).HasColumnName("id_perfume");
            entity.Property(e => e.IdTienda).HasColumnName("id_tienda");
            entity.Property(e => e.PrecioClp).HasColumnName("precio_clp");
            entity.Property(e => e.StockDisponible)
                .HasDefaultValue(true)
                .HasColumnName("stock_disponible");
            entity.Property(e => e.UrlCompra)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("url_compra");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
