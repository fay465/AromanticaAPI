import React from 'react';
import AppHeader from './AppHeader';

export default function AppLayout({ sesion, onLogout, children }) {
  return (
    <div className="app-shell">
      <AppHeader sesion={sesion} onLogout={onLogout} />
      <main className="page-content">{children}</main>
      <footer className="app-footer">
        <div>
          <div className="footer-brand">Aromántica</div>
          <div className="footer-note">Encuentra tu próxima fragancia. © 2025</div>
        </div>
        <div className="footer-location">Fragancias · Notas · Precios</div>
      </footer>
    </div>
  );
}
