using Aromantica.Comercios.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Aromantica.Comercios.API.Controllers
{
    [Route("api/v1/tiendas")]
    [ApiController]
    public class TiendasController : ControllerBase
    {
        private readonly ComerciosDbContext _context;

        public TiendasController(ComerciosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Tiendum>>> GetTiendas()
        {
            return await _context.Tienda.ToListAsync();
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Tiendum>> GetTienda(int id)
        {
            var tienda = await _context.Tienda.FindAsync(id);
            if (tienda == null)
                return Problem(detail: $"La tienda con ID {id} no fue encontrada.", statusCode: StatusCodes.Status404NotFound);

            return tienda;
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Tiendum>> PostTienda(Tiendum tienda)
        {
            if (string.IsNullOrWhiteSpace(tienda.NombreComercial) || string.IsNullOrWhiteSpace(tienda.SitioWebBase))
                return Problem(detail: "El nombre comercial y el sitio web base son obligatorios.", statusCode: StatusCodes.Status400BadRequest);

            _context.Tienda.Add(tienda);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTienda), new { id = tienda.IdTienda }, tienda);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutTienda(int id, Tiendum tienda)
        {
            if (id != tienda.IdTienda)
                return Problem(detail: "El ID de la tienda no coincide.", statusCode: StatusCodes.Status400BadRequest);

            _context.Entry(tienda).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteTienda(int id)
        {
            var tienda = await _context.Tienda.FindAsync(id);
            if (tienda == null)
                return Problem(detail: $"La tienda con ID {id} no fue encontrada.", statusCode: StatusCodes.Status404NotFound);

            _context.Tienda.Remove(tienda);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}