# Aromántica — Sistema Distribuido de Perfumería y Comparador de Precios

Sistema distribuido compuesto por **4 APIs RESTful independientes en ASP.NET Core (.NET 10)** y una aplicación cliente web **SPA en React + Vite** para la catalogación técnica olfativa de perfumes y comparación de precios en tiendas del mercado chileno.

- **Asignatura:** Construcción de Software
- **Integrantes:** Fabián Lagos y Pedro Díaz

---

## Arquitectura del Proyecto

### Backend (ASP.NET Core .NET 10 + Entity Framework Core + SQL Server)
Cada servicio gestiona su propia base de datos independiente, versiona sus rutas bajo `/api/v1/`, expone documentación OpenAPI en `/swagger`, valida tokens JWT por rol (`Administrador` y `Consultor`) y responde errores bajo el estándar RFC 7807 (`ProblemDetails`):

- **`Aromantica.Identidad.API`** (`http://localhost:5101`): Registro, inicio de sesión con cifrado `BCrypt`, emisión de tokens JWT y administración de usuarios.
- **`Aromantica.Catalogo.API`** (`http://localhost:5102`): CRUD de marcas y fichas técnicas de perfumes (pirámide olfativa, acordes, concentración, género, duración y estela) con filtros multicriterio.
- **`Aromantica.Comercios.API`** (`http://localhost:5103`): CRUD del directorio de tiendas comerciales nacionales.
- **`Aromantica.Cotizaciones.API`** (`http://localhost:5104`): CRUD y comparador de ofertas en pesos chilenos (CLP), integrado internamente mediante `IHttpClientFactory` (timeout de 5s y control `503`) con Catálogo y Comercios.

### Frontend (React + Vite)
Aplicación cliente web que consume los cuatro servicios mediante `Fetch API`, implementa autenticación con almacenamiento del token JWT en `localStorage` (con limpieza explícita al cerrar sesión), vistas diferenciadas por rol, búsqueda/filtros olfativos y mantenedores CRUD de perfumes y cotizaciones.

---

## Requisitos Previos

- **.NET 10 SDK** y **Visual Studio 2022**
- **Microsoft SQL Server Express** (`.\SQLEXPRESS`) y **SQL Server Management Studio (SSMS)**
- **Node.js (v18 o superior)** y **npm**
- *(Opcional)* **Python 3** para ejecutar el script de poblado automático (`poblar.py`)

---

## Variables de Entorno

El proyecto incluye una plantilla `.env.example` en la raíz **sin valores secretos**. Antes de ejecutar en un entorno nuevo, configura las cadenas de conexión y la clave `JWT_SECRET_KEY` (mínimo 32 caracteres) en tus variables de entorno locales tomando `.env.example` como referencia.

---

## Pasos de Ejecución

### 1. Base de Datos (SQL Server)
1. Abrir **SQL Server Management Studio (SSMS)** y conectarse a `.\SQLEXPRESS`.
2. Ejecutar el script `script_bd_aromantica.sql` para crear las 4 bases de datos y sus tablas (o ejecutar `dotnet ef database update` en cada proyecto).

### 2. Backend (4 APIs en paralelo)
1. Abrir la solución `Aromantica.slnx` en Visual Studio.
2. Hacer clic derecho sobre la solución → **Configurar proyectos de inicio...** → **Proyectos de inicio múltiples** y dejar las 4 APIs en **Iniciar** (o **Iniciar sin depurar**).
3. Ejecutar la solución y verificar los endpoints en Swagger:
   - `http://localhost:5101/swagger`
   - `http://localhost:5102/swagger`
   - `http://localhost:5103/swagger`
   - `http://localhost:5104/swagger`

### 3. Poblado Inicial de Datos (Opcional)
Para poblar automáticamente las tiendas nacionales, 16 marcas, 32 perfumes y cotizaciones:
1. Crear o iniciar sesión con una cuenta de rol `Administrador` en `POST /api/v1/auth/login` (`http://localhost:5101/swagger`) y copiar el token JWT.
2. Pegar el token en `JWT_TOKEN` dentro de `poblar.py`.
3. Ejecutar desde terminal:

```bash
pip install requests urllib3
python poblar.py
```

### 4. Frontend (React + Vite)
Con las 4 APIs corriendo, abrir una terminal en la carpeta del cliente React y ejecutar:

```bash
npm install
npm run dev
```

Abrir en el navegador la URL indicada por Vite (por defecto `http://localhost:5173`).
