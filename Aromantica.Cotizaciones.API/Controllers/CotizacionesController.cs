using System.Net.Http.Json;
using Aromantica.Cotizaciones.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Aromantica.Cotizaciones.API.Controllers
{
    [Route("api/v1/cotizaciones")]
    [ApiController]
    public class CotizacionesController : ControllerBase
    {
        private readonly CotizacionesDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public CotizacionesController(CotizacionesDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        public record PerfumeExternoDto(int IdPerfume, string Nombre, string NombreMarca, string Concentracion);
        public record TiendaExternaDto(int IdTienda, string NombreComercial, string SitioWebBase);

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<OfertaPrecio>>> GetCotizaciones(
            [FromQuery] int? idPerfume,
            [FromQuery] int? formatoMl)
        {
            var query = _context.OfertaPrecios.AsQueryable();

            if (idPerfume.HasValue)
                query = query.Where(o => o.IdPerfume == idPerfume.Value);

            if (formatoMl.HasValue)
                query = query.Where(o => o.FormatoMl == formatoMl.Value);

            return await query.OrderBy(o => o.PrecioClp).ToListAsync();
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCotizacion(int id)
        {
            var oferta = await _context.OfertaPrecios.FindAsync(id);
            if (oferta == null)
                return Problem(detail: $"La cotización con ID {id} no existe.", statusCode: StatusCodes.Status404NotFound);

            try
            {
                var catalogoClient = _httpClientFactory.CreateClient("CatalogoClient");
                var comerciosClient = _httpClientFactory.CreateClient("ComerciosClient");

                var perfume = await catalogoClient.GetFromJsonAsync<PerfumeExternoDto>($"/api/v1/perfumes/{oferta.IdPerfume}");
                var tienda = await comerciosClient.GetFromJsonAsync<TiendaExternaDto>($"/api/v1/tiendas/{oferta.IdTienda}");

                return Ok(new
                {
                    oferta.IdOferta,
                    oferta.IdPerfume,
                    NombrePerfume = perfume?.Nombre ?? "Desconocido",
                    MarcaPerfume = perfume?.NombreMarca ?? "Desconocida",
                    oferta.IdTienda,
                    NombreTienda = tienda?.NombreComercial ?? "Desconocida",
                    oferta.PrecioClp,
                    oferta.FormatoMl,
                    oferta.StockDisponible,
                    oferta.UrlCompra,
                    oferta.FechaActualizacion
                });
            }
            catch (Exception ex) when (ex is HttpRequestException || ex is TaskCanceledException)
            {
                return Problem(
                    title: "Servicio externo no disponible (RNF-03)",
                    detail: "No fue posible comunicarse con Catalogo.API o Comercios.API dentro del tiempo máximo de espera (5s).",
                    statusCode: StatusCodes.Status503ServiceUnavailable);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PostCotizacion([FromBody] OfertaPrecio oferta)
        {
            if (oferta.PrecioClp <= 0 || oferta.FormatoMl <= 0)
                return Problem(detail: "El precio en CLP y el formato en ml deben ser mayores a cero.", statusCode: StatusCodes.Status400BadRequest);

            try
            {
                var catalogoClient = _httpClientFactory.CreateClient("CatalogoClient");
                var comerciosClient = _httpClientFactory.CreateClient("ComerciosClient");

                var respPerfume = await catalogoClient.GetAsync($"/api/v1/perfumes/{oferta.IdPerfume}");
                if (!respPerfume.IsSuccessStatusCode)
                    return Problem(detail: $"El perfume con ID {oferta.IdPerfume} no existe en Catalogo.API.", statusCode: StatusCodes.Status400BadRequest);

                var respTienda = await comerciosClient.GetAsync($"/api/v1/tiendas/{oferta.IdTienda}");
                if (!respTienda.IsSuccessStatusCode)
                    return Problem(detail: $"La tienda con ID {oferta.IdTienda} no existe en Comercios.API.", statusCode: StatusCodes.Status400BadRequest);
            }
            catch (Exception ex) when (ex is HttpRequestException || ex is TaskCanceledException)
            {
                return Problem(
                    title: "Fallo de comunicación entre servicios (RNF-03)",
                    detail: "Catalogo.API o Comercios.API no respondió dentro de los 5 segundos permitidos.",
                    statusCode: StatusCodes.Status503ServiceUnavailable);
            }

            _context.OfertaPrecios.Add(oferta);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCotizacion), new { id = oferta.IdOferta }, oferta);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutCotizacion(int id, OfertaPrecio oferta)
        {
            if (id != oferta.IdOferta)
                return Problem(detail: "El ID de la cotización no coincide.", statusCode: StatusCodes.Status400BadRequest);

            _context.Entry(oferta).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteCotizacion(int id)
        {
            var oferta = await _context.OfertaPrecios.FindAsync(id);
            if (oferta == null)
                return Problem(detail: $"La cotización con ID {id} no existe.", statusCode: StatusCodes.Status404NotFound);

            _context.OfertaPrecios.Remove(oferta);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}