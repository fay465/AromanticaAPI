import React from 'react';

export default function AppHeader({ sesion, onLogout }) {
  const usuario = sesion?.usuario || sesion || {};

  return (
    <header className="site-header">
      <a className="site-brand" href="#" aria-label="Aromántica, inicio">
        <span className="brand-mark">A</span>
        <span className="brand-copy">
          <strong>Aromántica</strong>
          <small>Descubre tu próxima fragancia</small>
        </span>
      </a>
      <nav className="site-nav" aria-label="Navegación principal">
        <span>Catálogo de fragancias</span>
        <span>Precios y disponibilidad</span>
        <span>Explora y compara</span>
      </nav>
      <div className="header-account">
        <span className="currency-badge">CLP</span>
        <span className="account-copy">
          <strong>{usuario.nombreUsuario || usuario.correo || 'Coleccionista'}</strong>
          <small>Rol: {usuario.rol || 'Usuario'}</small>
        </span>
        {onLogout && (
          <button className="icon-button logout-button" type="button" onClick={onLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
            <span className="material-symbols-outlined">logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
