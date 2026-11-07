# Aromántica - Backend Distribuido (.NET 8)

Repositorio del backend para el sistema **Aromántica** (catálogo técnico de perfumería y comparador de precios en tiendas nacionales).

- **Asignatura:** Construcción de Software
- **Integrantes:** Pedro Díaz y Fabián Lagos

## Arquitectura del Proyecto

La solución está compuesta por 4 APIs RESTful independientes desarrolladas en **ASP.NET Core (.NET 8)** con **Entity Framework Core**, **SQL Server**, autenticación **JWT** y documentación en **Swagger**:

- **Aromantica.Identidad.API** (`http://localhost:5101`): Registro, inicio de sesión, emisión de tokens JWT y administración de usuarios/roles (`Administrador` y `Consultor`).
- **Aromantica.Catalogo.API** (`http://localhost:5102`): Gestión de marcas y fichas técnicas de perfumes (pirámide olfativa, acordes, concentración, género, duración y estela).
- **Aromantica.Comercios.API** (`http://localhost:5103`): Directorio de tiendas comerciales nacionales.
- **Aromantica.Cotizaciones.API** (`http://localhost:5104`): Comparador de ofertas en pesos chilenos (CLP), comunicado internamente mediante `IHttpClientFactory` con Catálogo y Comercios.

## Ejecución y Poblado de Datos

1. Abrir **SQL Server Management Studio (SSMS)** y ejecutar el script `script_bd_aromantica.sql` para crear las 4 bases de datos y sus tablas.
2. Abrir la solución `Aromantica.slnx` en **Visual Studio** e iniciar los 4 proyectos simultáneamente.
3. Para poblar automáticamente las bases de datos con las tiendas nacionales, las 16 marcas, los 32 perfumes y las cotizaciones extraídas vía scraping:
   - Crear/iniciar sesión con una cuenta de rol `Administrador` en el Swagger de **Identidad.API** (`POST /api/v1/auth/login`) y copiar el token JWT generado.
   - Abrir el archivo `poblar.py` en un editor de texto y pegar el token dentro de la variable `JWT_TOKEN = "TU_TOKEN_AQUI"`.
   - Ejecutar el script desde la terminal:

```bash
pip install requests urllib3
python poblar.py