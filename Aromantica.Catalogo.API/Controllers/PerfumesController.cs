using Aromantica.Catalogo.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Aromantica.Catalogo.API.Controllers
{
    [Route("api/v1/perfumes")]
    [ApiController]
    public class PerfumesController : ControllerBase
    {
        private readonly CatalogoDbContext _context;

        public PerfumesController(CatalogoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<object>>> GetPerfumes(
            [FromQuery] string? nombre,
            [FromQuery] int? idMarca,
            [FromQuery] string? notas,
            [FromQuery] string? concentracion,
            [FromQuery] string? genero)
        {
            var query = _context.Perfumes.Include(p => p.IdMarcaNavigation).AsQueryable();

            if (!string.IsNullOrWhiteSpace(nombre))
                query = query.Where(p => p.Nombre.Contains(nombre));

            if (idMarca.HasValue)
                query = query.Where(p => p.IdMarca == idMarca.Value);

            if (!string.IsNullOrWhiteSpace(concentracion))
                query = query.Where(p => p.Concentracion == concentracion);

            if (!string.IsNullOrWhiteSpace(genero))
                query = query.Where(p => p.Genero == genero);

            if (!string.IsNullOrWhiteSpace(notas))
                query = query.Where(p =>
                    p.NotasSalida.Contains(notas) ||
                    p.NotasCorazon.Contains(notas) ||
                    p.NotasFondo.Contains(notas) ||
                    p.AcordesPredominantes.Contains(notas));

            var resultado = await query.Select(p => new
            {
                p.IdPerfume,
                p.Nombre,
                p.IdMarca,
                NombreMarca = p.IdMarcaNavigation != null ? p.IdMarcaNavigation.Nombre : "",
                p.Concentracion,
                p.Genero,
                p.FamiliaOlfativa,
                p.AcordesPredominantes,
                p.NotasSalida,
                p.NotasCorazon,
                p.NotasFondo,
                p.Duracion,
                p.Estela,
                p.ImagenUrl
            }).ToListAsync();

            return Ok(resultado);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetPerfume(int id)
        {
            var p = await _context.Perfumes
                .Include(x => x.IdMarcaNavigation)
                .FirstOrDefaultAsync(x => x.IdPerfume == id);

            if (p == null)
                return Problem(detail: $"El perfume con ID {id} no existe.", statusCode: StatusCodes.Status404NotFound);

            return Ok(new
            {
                p.IdPerfume,
                p.Nombre,
                p.IdMarca,
                NombreMarca = p.IdMarcaNavigation != null ? p.IdMarcaNavigation.Nombre : "",
                p.Concentracion,
                p.Genero,
                p.FamiliaOlfativa,
                p.AcordesPredominantes,
                p.NotasSalida,
                p.NotasCorazon,
                p.NotasFondo,
                p.Duracion,
                p.Estela,
                p.ImagenUrl
            });
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Perfume>> PostPerfume(Perfume perfume)
        {
            if (string.IsNullOrWhiteSpace(perfume.Nombre))
                return Problem(detail: "El nombre del perfume es obligatorio.", statusCode: StatusCodes.Status400BadRequest);

            _context.Perfumes.Add(perfume);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPerfume), new { id = perfume.IdPerfume }, perfume);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutPerfume(int id, Perfume perfume)
        {
            if (id != perfume.IdPerfume)
                return Problem(detail: "El ID de la URL no coincide con el ID del perfume.", statusCode: StatusCodes.Status400BadRequest);

            _context.Entry(perfume).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeletePerfume(int id)
        {
            var perfume = await _context.Perfumes.FindAsync(id);
            if (perfume == null)
                return Problem(detail: $"El perfume con ID {id} no existe.", statusCode: StatusCodes.Status404NotFound);

            _context.Perfumes.Remove(perfume);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}