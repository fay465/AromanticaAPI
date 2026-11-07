using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Aromantica.Identidad.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Aromantica.Identidad.API.Controllers
{
    [Route("api/v1/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IdentidadDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(IdentidadDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public record RegisterRequest(string NombreUsuario, string Correo, string Password, string Rol = "Consultor");
        public record LoginRequest(string Correo, string Password);

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Correo == req.Correo))
                return Problem(detail: "El correo electrónico ya está registrado.", statusCode: StatusCodes.Status400BadRequest, title: "Error de validación");

            var rolValido = (req.Rol == "Administrador" || req.Rol == "Consultor") ? req.Rol : "Consultor";

            var nuevoUsuario = new Usuario
            {
                NombreUsuario = req.NombreUsuario,
                Correo = req.Correo,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                Rol = rolValido,
                Activo = true
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new
            {
                nuevoUsuario.IdUsuario,
                nuevoUsuario.NombreUsuario,
                nuevoUsuario.Correo,
                nuevoUsuario.Rol,
                nuevoUsuario.Activo
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _context.Usuarios.SingleOrDefaultAsync(u => u.Correo == req.Correo);
            if (user == null || !user.Activo)
                return Problem(detail: "Credenciales inválidas o cuenta inactiva.", statusCode: StatusCodes.Status401Unauthorized, title: "No autorizado");

            if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Problem(detail: "Credenciales inválidas.", statusCode: StatusCodes.Status401Unauthorized, title: "No autorizado");

            string token = GenerarToken(user);

            return Ok(new
            {
                token,
                usuario = new
                {
                    user.IdUsuario,
                    user.NombreUsuario,
                    user.Correo,
                    user.Rol
                }
            });
        }

        private string GenerarToken(Usuario user)
        {
            var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? _config["Jwt:Key"]!;
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.IdUsuario.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Correo),
                new Claim("nombre", user.NombreUsuario),
                new Claim(ClaimTypes.Role, user.Rol)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}