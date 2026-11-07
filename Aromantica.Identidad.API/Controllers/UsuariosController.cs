using Aromantica.Identidad.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Aromantica.Identidad.API.Controllers
{
    [Route("api/v1/usuarios")]
    [ApiController]
    [Authorize(Roles = "Administrador")]
    public class UsuariosController : ControllerBase
    {
        private readonly IdentidadDbContext _context;

        public UsuariosController(IdentidadDbContext context)
        {
            _context = context;
        }

        public record ActualizarUsuarioDto(string Rol, bool Activo);

        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var lista = await _context.Usuarios
                .Select(u => new { u.IdUsuario, u.NombreUsuario, u.Correo, u.Rol, u.Activo })
                .ToListAsync();
            return Ok(lista);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, [FromBody] ActualizarUsuarioDto dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return Problem(detail: $"Usuario con ID {id} no encontrado.", statusCode: StatusCodes.Status404NotFound);

            usuario.Rol = dto.Rol;
            usuario.Activo = dto.Activo;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return Problem(detail: $"Usuario con ID {id} no encontrado.", statusCode: StatusCodes.Status404NotFound);

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}