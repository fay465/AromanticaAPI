using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Aromantica.Catalogo.API.Models;

public partial class CatalogoDbContext : DbContext
{
    public CatalogoDbContext()
    {
    }

    public CatalogoDbContext(DbContextOptions<CatalogoDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Marca> Marcas { get; set; }

    public virtual DbSet<Perfume> Perfumes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Marca>(entity =>
        {
            entity.HasKey(e => e.IdMarca).HasName("PK__Marca__7E43E99EACEE574F");

            entity.ToTable("Marca");

            entity.Property(e => e.IdMarca).HasColumnName("id_marca");
            entity.Property(e => e.Nombre)
                .HasMaxLength(120)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.PaisOrigen)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("pais_origen");
        });

        modelBuilder.Entity<Perfume>(entity =>
        {
            entity.HasKey(e => e.IdPerfume).HasName("PK__Perfume__97782D34AD4AD410");

            entity.ToTable("Perfume");

            entity.Property(e => e.IdPerfume).HasColumnName("id_perfume");
            entity.Property(e => e.AcordesPredominantes)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("acordes_predominantes");
            entity.Property(e => e.Concentracion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("concentracion");
            entity.Property(e => e.Duracion)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("duracion");
            entity.Property(e => e.Estela)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("estela");
            entity.Property(e => e.FamiliaOlfativa)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("familia_olfativa");
            entity.Property(e => e.Genero)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("genero");
            entity.Property(e => e.IdMarca).HasColumnName("id_marca");
            entity.Property(e => e.ImagenUrl)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("imagen_url");
            entity.Property(e => e.Nombre)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.NotasCorazon)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("notas_corazon");
            entity.Property(e => e.NotasFondo)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("notas_fondo");
            entity.Property(e => e.NotasSalida)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("notas_salida");

            entity.HasOne(d => d.IdMarcaNavigation).WithMany(p => p.Perfumes)
                .HasForeignKey(d => d.IdMarca)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Perfume_Marca");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
