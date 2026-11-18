import React, { useState } from 'react';
import { authService } from '../services/authService';

export default function Login({ onLoginSuccess, irARegistro }) {
  const [formData, setFormData] = useState({ correo: '', password: '' });
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
      const data = await authService.login(formData);
      localStorage.setItem('token', data.token);
      setMensaje('¡Sesión iniciada!');
      if (onLoginSuccess) onLoginSuccess(data);
    } catch (error) {
      setMensaje(`Error en el login: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <aside className="auth-editorial login-art">
          <div className="auth-brand">Aromántica<span>Tu espacio para explorar fragancias</span></div>
          <div className="auth-editorial-copy">
            <div className="eyebrow">Descubre algo nuevo</div>
            <h2>Encuentra una fragancia que <em>hable de ti</em></h2>
            <p>Explora perfumes, conoce sus notas y compara precios en un solo lugar.</p>
            <div className="auth-tickers">
              <div className="auth-ticker"><small>EXPLORA</small><strong>Familias olfativas</strong></div>
              <div className="auth-ticker"><small>COMPARA</small><strong>Precios y tiendas</strong></div>
            </div>
          </div>
          <div className="auth-ledger">Aromántica · Tu guía de perfumes</div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="eyebrow">Bienvenido a Aromántica</div>
            <h1>Iniciar Sesión</h1>
            <p className="page-subtitle">Inicia sesión para explorar perfumes, conocer sus notas y comparar precios.</p>

            {mensaje && <p className={`auth-feedback${mensaje.startsWith('Error') ? ' error' : ''}`} role="status">{mensaje}</p>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">Correo electrónico</span>
                <span className="field-with-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">alternate_email</span>
                  <input className="field-input" type="email" name="correo" autoComplete="email" placeholder="tu@correo.com" value={formData.correo} onChange={handleChange} required />
                </span>
              </label>

              <label className="field">
                <span className="field-label">Contraseña</span>
                <span className="password-input-wrap field-with-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                  <input className="field-input" type={mostrarPassword ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="••••••••••••" value={formData.password} onChange={handleChange} required />
                  <button className="password-toggle" type="button" aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setMostrarPassword(!mostrarPassword)}>
                    <span className="material-symbols-outlined">{mostrarPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </span>
              </label>

              <div className="auth-options">
                <label className="check-label"><input type="checkbox" defaultChecked /> Mantener sesión privada segura</label>
                <span>Sesión segura</span>
              </div>

              <button className="primary-button" type="submit" disabled={cargando}>
                <span>{cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
                <span className="material-symbols-outlined">{cargando ? 'progress_activity' : 'arrow_forward'}</span>
              </button>
            </form>

            <div className="auth-switch">
              ¿No tienes una cuenta aún?{' '}
              <button className="text-button" type="button" onClick={irARegistro}>Regístrate aquí</button>
            </div>
            <div className="auth-footnote"><span>Descubre · Compara · Elige</span><span>Aromántica</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}
