\# Aromántica - Backend Distribuido (.NET 8)



Repositorio del backend para el sistema \*\*Aromántica\*\* (catálogo técnico de perfumería y comparador de precios en tiendas nacionales).



\* \*\*Asignatura:\*\* Construcción de Software

\* \*\*Integrantes:\*\* Pedro Díaz y Fabián Lagos



\---



\## Arquitectura del Proyecto



La solución está compuesta por 4 APIs RESTful independientes desarrolladas en \*\*ASP.NET Core (.NET 8)\*\* con \*\*Entity Framework Core\*\*, \*\*SQL Server\*\*, autenticación \*\*JWT\*\* y documentación en \*\*Swagger\*\*:



\* \*\*`Aromantica.Identidad.API` (`http://localhost:5101`)\*\*: Registro, inicio de sesión, emisión de tokens JWT y administración de usuarios/roles (`Administrador` y `Consultor`).

\* \*\*`Aromantica.Catalogo.API` (`http://localhost:5102`)\*\*: Gestión de marcas y fichas técnicas de perfumes (pirámide olfativa, acordes, concentración, género, duración y estela).

\* \*\*`Aromantica.Comercios.API` (`http://localhost:5103`)\*\*: Directorio de tiendas comerciales nacionales.

\* \*\*`Aromantica.Cotizaciones.API` (`http://localhost:5104`)\*\*: Comparador de ofertas en pesos chilenos (CLP), comunicado internamente mediante `IHttpClientFactory` con Catálogo y Comercios.



\---



\## Ejecución y Poblado de Datos (`poblar.py`)



1\. Clonar el repositorio y abrir la solución `Aromantica.slnx` en \*\*Visual Studio\*\*.

2\. Aplicar las migraciones de Entity Framework Core en cada API (`Update-Database`) e iniciar los 4 proyectos simultáneamente.

3\. Para poblar automáticamente las bases de datos con las tiendas nacionales, las 16 marcas, los 32 perfumes y las cotizaciones extraídas vía scraping:

&#x20;  \* Iniciar sesión con una cuenta de rol `Administrador` en el Swagger de \*\*`Identidad.API`\*\* (`POST /api/v1/auth/login`) y copiar el token JWT generado.

&#x20;  \* Abrir el archivo \*\*`poblar.py`\*\* en un editor de texto y pegar el token dentro de la variable `JWT\_TOKEN = "TU\_TOKEN\_AQUI"`.

&#x20;  \* Ejecutar el script desde la terminal:

&#x20;    ```bash

&#x20;    pip install requests urllib3

&#x20;    python poblar.py

&#x20;    ```

