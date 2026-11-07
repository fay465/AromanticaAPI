using Aromantica.Catalogo.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Aromantica.Catalogo.API.Controllers
{
    [Route("api/v1/marcas")]
    [ApiController]
    public class MarcasController : ControllerBase
    {
        private readonly CatalogoDbContext _context;

        public MarcasController(CatalogoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Marca>>> GetMarcas()
        {
            return await _context.Marcas.ToListAsync();
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Marca>> GetMarca(int id)
        {
            var marca = await _context.Marcas.FindAsync(id);
            if (marca == null)
                return Problem(detail: $"La marca con ID {id} no existe.", statusCode: StatusCodes.Status404NotFound);

            return marca;
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Marca>> PostMarca(Marca marca)
        {
            _context.Marcas.Add(marca);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMarca), new { id = marca.IdMarca }, marca);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutMarca(int id, Marca marca)
        {
            if (id != marca.IdMarca)
                return Problem(detail: "El ID de la ruta no coincide con el cuerpo de la petición.", statusCode: StatusCodes.Status400BadRequest);

            _context.Entry(marca).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteMarca(int id)
        {
            var marca = await _context.Marcas.FindAsync(id);
            if (marca == null)
            {
                return Problem(
                    detail: $"No se encontró la marca con ID {id}.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Marca no encontrada");
            }

            // Validar si existen perfumes asociados antes de intentar borrar
            bool tienePerfumes = await _context.Perfumes.AnyAsync(p => p.IdMarca == id);
            if (tienePerfumes)
            {
                return Problem(
                    detail: "No se puede eliminar la marca porque tiene perfumes asociados en el catálogo. Elimine o reasigne los perfumes primero.",
                    statusCode: StatusCodes.Status409Conflict,
                    title: "Conflicto de integridad referencial");
            }

            _context.Marcas.Remove(marca);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}