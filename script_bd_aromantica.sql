USE [master];
GO

-- ==========================================================
-- 1. BASE DE DATOS: AromanticaIdentidadDB (RF-01, RF-02)
-- ==========================================================
IF DB_ID('AromanticaIdentidadDB') IS NOT NULL
BEGIN
    ALTER DATABASE [AromanticaIdentidadDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [AromanticaIdentidadDB];
END
GO
CREATE DATABASE [AromanticaIdentidadDB];
GO
USE [AromanticaIdentidadDB];
GO

CREATE TABLE [dbo].[Usuario](
    [id_usuario] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [nombre_usuario] VARCHAR(100) NOT NULL,
    [correo] VARCHAR(150) NOT NULL UNIQUE,
    [password_hash] VARCHAR(MAX) NOT NULL,
    [rol] VARCHAR(30) NOT NULL, -- 'Administrador' o 'Consultor'
    [activo] BIT NOT NULL DEFAULT 1
);
GO

-- ==========================================================
-- 2. BASE DE DATOS: AromanticaCatalogoDB (RF-03)
-- ==========================================================
USE [master];
GO
IF DB_ID('AromanticaCatalogoDB') IS NOT NULL
BEGIN
    ALTER DATABASE [AromanticaCatalogoDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [AromanticaCatalogoDB];
END
GO
CREATE DATABASE [AromanticaCatalogoDB];
GO
USE [AromanticaCatalogoDB];
GO

CREATE TABLE [dbo].[Marca](
    [id_marca] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [nombre] VARCHAR(120) NOT NULL,
    [pais_origen] VARCHAR(80) NOT NULL
);
GO

CREATE TABLE [dbo].[Perfume](
    [id_perfume] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [nombre] VARCHAR(150) NOT NULL,
    [id_marca] INT NOT NULL,
    [concentracion] VARCHAR(50) NOT NULL, -- EDT, EDP, Parfum, Elixir
    [genero] VARCHAR(40) NOT NULL,        -- Hombre, Mujer, Unisex
    [familia_olfativa] VARCHAR(100) NOT NULL,
    [acordes_predominantes] VARCHAR(250) NOT NULL,
    [notas_salida] VARCHAR(250) NOT NULL,
    [notas_corazon] VARCHAR(250) NOT NULL,
    [notas_fondo] VARCHAR(250) NOT NULL,
    [duracion] VARCHAR(60) NOT NULL,
    [estela] VARCHAR(60) NOT NULL,
    [imagen_url] VARCHAR(500) NULL,
    CONSTRAINT [FK_Perfume_Marca] FOREIGN KEY([id_marca]) REFERENCES [dbo].[Marca]([id_marca])
);
GO

-- ==========================================================
-- 3. BASE DE DATOS: AromanticaComerciosDB (RF-04)
-- ==========================================================
USE [master];
GO
IF DB_ID('AromanticaComerciosDB') IS NOT NULL
BEGIN
    ALTER DATABASE [AromanticaComerciosDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [AromanticaComerciosDB];
END
GO
CREATE DATABASE [AromanticaComerciosDB];
GO
USE [AromanticaComerciosDB];
GO

CREATE TABLE [dbo].[Tienda](
    [id_tienda] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [nombre_comercial] VARCHAR(120) NOT NULL,
    [tipo_comercio] VARCHAR(80) NOT NULL, -- 'Retail Departamental' o 'Perfumería Especializada'
    [sitio_web_base] VARCHAR(250) NOT NULL,
    [logo_url] VARCHAR(500) NULL,
    [activo] BIT NOT NULL DEFAULT 1
);
GO

-- ==========================================================
-- 4. BASE DE DATOS: AromanticaCotizacionesDB (RF-05, RF-06)
-- ==========================================================
USE [master];
GO
IF DB_ID('AromanticaCotizacionesDB') IS NOT NULL
BEGIN
    ALTER DATABASE [AromanticaCotizacionesDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [AromanticaCotizacionesDB];
END
GO
CREATE DATABASE [AromanticaCotizacionesDB];
GO
USE [AromanticaCotizacionesDB];
GO

CREATE TABLE [dbo].[OfertaPrecio](
    [id_oferta] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [id_perfume] INT NOT NULL,
    [id_tienda] INT NOT NULL,
    [precio_clp] INT NOT NULL,
    [formato_ml] INT NOT NULL,
    [stock_disponible] BIT NOT NULL DEFAULT 1,
    [url_compra] VARCHAR(500) NOT NULL,
    [fecha_actualizacion] DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE)
);
GO