import React, { useState } from 'react';
import { authService } from '../services/authService';

export default function Register({ irALogin }) {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    correo: '',
    password: '',
    rol: 'Consultor'
  });
  const [mensaje, setMensaje] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');
    try {
      await authService.register(formData);
      setMensaje('¡Registro exitoso! Ya puedes iniciar sesión.');
    } catch (error) {
      setMensaje(`Error en el registro: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card register-card">
        <aside className="auth-editorial register-art">
          <div className="auth-brand">Aromántica<span>Explora el mundo de las fragancias</span></div>
          <div className="auth-editorial-copy">
            <div className="eyebrow">Tu próxima fragancia te espera</div>
            <h2>Descubre aromas y encuentra <em>tu favorito</em></h2>
            <p>Guarda tus perfumes preferidos, consulta sus notas y compara opciones disponibles.</p>
          </div>
          <div className="auth-ledger">Aromántica · Explora a tu manera</div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="eyebrow">Crea tu cuenta</div>
            <h1>Registro de Usuario</h1>
            <p className="page-subtitle">Crea tu perfil para guardar fragancias y consultar sus características.</p>

            {mensaje && <p className={`auth-feedback${mensaje.startsWith('Error') ? ' error' : ''}`} role="status">{mensaje}</p>}

            <form className="auth-form registration-fields" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">Nombre de usuario</span>
                <span className="field-with-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">person</span>
                  <input className="field-input" type="text" name="nombreUsuario" autoComplete="username" placeholder="Ej: Alexandre Valois" value={formData.nombreUsuario} onChange={handleChange} required />
                </span>
              </label>

              <label className="field">
                <span className="field-label">Correo electrónico</span>
                <span className="field-with-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">alternate_email</span>
                  <input className="field-input" type="email" name="correo" autoComplete="email" placeholder="nombre@correo.com" value={formData.correo} onChange={handleChange} required />
                </span>
              </label>

              <label className="field">
                <span className="field-label">Contraseña <span className="field-hint">Mínimo 8 caracteres</span></span>
                <span className="password-input-wrap field-with-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                  <input className="field-input" type={mostrarPassword ? 'text' : 'password'} name="password" autoComplete="new-password" placeholder="••••••••••••" value={formData.password} onChange={handleChange} required />
                  <button className="password-toggle" type="button" aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setMostrarPassword(!mostrarPassword)}>
                    <span className="material-symbols-outlined">{mostrarPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </span>
              </label>

              <label className="field">
                <span className="field-label">Tipo de cuenta</span>
                <span className="field-with-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">workspace_premium</span>
                  <select className="field-select" name="rol" value={formData.rol} onChange={handleChange}>
                    <option value="Consultor">Usuario</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </span>
              </label>

              <div className="security-note">Tus datos se utilizan para gestionar tu cuenta de Aromántica.</div>
              <button className="primary-button" type="submit" disabled={cargando}>
                <span>{cargando ? 'Registrando...' : 'Crear cuenta'}</span>
                <span className="material-symbols-outlined">{cargando ? 'progress_activity' : 'arrow_forward'}</span>
              </button>
            </form>

            <div className="auth-switch">
              ¿Ya tienes una cuenta?{' '}
              <button className="text-button" type="button" onClick={irALogin}>Iniciar sesión</button>
            </div>
            <div className="auth-footnote"><span>Descubre tus aromas favoritos</span><span>Aromántica © 2025</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}
