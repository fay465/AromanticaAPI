import React, { useEffect, useMemo, useState } from 'react';
import { ofertaService } from '../services/ofertaService';
import AppLayout from '../components/AppLayout';

function ItemPerfume({ perfume, onSelect }) {
  const [precio, setPrecio] = useState(null);
  const [idConsultado, setIdConsultado] = useState(null);
  const [idConError, setIdConError] = useState(null);
  const cargandoPrecio = Boolean(perfume?.idPerfume && idConsultado !== perfume.idPerfume);

  useEffect(() => {
    let activo = true;
    if (perfume?.idPerfume) {
      ofertaService.getOfertasPorPerfume(perfume.idPerfume)
        .then(cotizaciones => {
          if (!activo) return;
          const preciosValidos = cotizaciones
            .map(c => Number(c.precioClp))
            .filter(p => Number.isFinite(p) && p > 0);
          setPrecio(preciosValidos.length ? Math.min(...preciosValidos) : null);
        })
        .catch(() => {
          if (activo) {
            setPrecio(null);
            setIdConError(perfume.idPerfume);
          }
        })
        .finally(() => {
          if (activo) setIdConsultado(perfume.idPerfume);
        });
    }

    return () => { activo = false; };
  }, [perfume?.idPerfume]);

  const etiquetas = (perfume.familiaOlfativa || perfume.familiasOlfativas || '')
    .split(/[;,]/)
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 2);

  return (
    <article className="perfume-card">
      <div className="perfume-card-main">
        <div className="perfume-card-brand">
          <span>{perfume.nombreMarca || perfume.marca || 'Marca independiente'}</span>
          <span className="perfume-type">{perfume.concentracion || 'Perfume'}</span>
        </div>
        <div className="perfume-image-box">
          {perfume.imagenUrl && <img src={perfume.imagenUrl} alt={perfume.nombre} loading="lazy" />}
        </div>
        <h2>{perfume.nombre}</h2>
        <p className="perfume-card-description">{perfume.descripcion || perfume.acordesPredominantes || 'Una composición olfativa de carácter singular, seleccionada para la colección privada.'}</p>
        <div className="tag-list">
          {etiquetas.map(etiqueta => <span className="tag" key={etiqueta}>{etiqueta}</span>)}
        </div>
      </div>
      <div className="perfume-card-bottom">
        <div>
          <div className="price-caption">Mejor cotización</div>
          <div className="price-value">
            {cargandoPrecio ? 'Consultando...' : idConError === perfume.idPerfume ? 'Precio no disponible' : precio !== null ? `Desde $${precio.toLocaleString('es-CL')} CLP` : 'Sin cotización'}
          </div>
        </div>
        <button className="primary-button card-action" type="button" onClick={() => onSelect(perfume)}>
          Ver ficha completa <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </article>
  );
}

export default function CatalogoView({ sesion, perfumes, errorCarga, onSelectPerfume, onCrearPerfume, onLogout }) {
  const usuario = sesion?.usuario || sesion || {};
  const esAdmin = ['admin', 'administrador'].includes(String(usuario.rol || '').toLocaleLowerCase('es'));
  const [busqueda, setBusqueda] = useState('');
  const [familiaActiva, setFamiliaActiva] = useState('Todas');

  const familias = useMemo(() => {
    const disponibles = perfumes.flatMap(perfume => (perfume.familiaOlfativa || perfume.familiasOlfativas || '')
      .split(/[;,]/).map(item => item.trim()).filter(Boolean));
    return ['Todas', ...new Set(disponibles)].slice(0, 6);
  }, [perfumes]);

  const perfumesFiltrados = useMemo(() => perfumes.filter(perfume => {
    const texto = `${perfume.nombre || ''} ${perfume.nombreMarca || perfume.marca || ''} ${perfume.familiaOlfativa || perfume.familiasOlfativas || ''}`.toLocaleLowerCase('es');
    const coincideBusqueda = texto.includes(busqueda.toLocaleLowerCase('es'));
    const coincideFamilia = familiaActiva === 'Todas' || texto.includes(familiaActiva.toLocaleLowerCase('es'));
    return coincideBusqueda && coincideFamilia;
  }), [perfumes, busqueda, familiaActiva]);

  return (
    <AppLayout sesion={sesion} onLogout={onLogout}>
      <section className="catalog-heading">
        <div>
          <div className="page-kicker">Aromántica · Explora fragancias</div>
          <h1 className="page-title">Catálogo de Perfumes</h1>
          <p className="page-subtitle">Bienvenido, {usuario.nombreUsuario || usuario.correo || 'coleccionista'}.</p>
        </div>
        <div className="catalog-heading-actions">
          {esAdmin && <button className="primary-button" type="button" onClick={onCrearPerfume}><span className="material-symbols-outlined">add</span> Añadir perfume</button>}
          <div className="catalog-stats" aria-label="Resumen del catálogo">
            <div className="catalog-stat"><small>Perfumes registrados</small><strong>{perfumes.length} perfumes</strong></div>
            <div className="catalog-stat"><small>Colección</small><strong>Fragancias</strong></div>
            <div className="catalog-stat"><small>Moneda</small><strong>CLP</strong></div>
          </div>
        </div>
      </section>

      <section className="catalog-toolbar" aria-label="Buscar y filtrar perfumes">
        <label className="catalog-search field">
          <span className="field-label">Buscar por fragancia, marca o nota</span>
          <input className="field-input" type="search" value={busqueda} onChange={event => setBusqueda(event.target.value)} placeholder="Buscar fragancia..." />
        </label>
        <div className="filter-chips">
          {familias.map(familia => (
            <button className={`filter-chip${familiaActiva === familia ? ' active' : ''}`} type="button" key={familia} onClick={() => setFamiliaActiva(familia)}>{familia}</button>
          ))}
        </div>
      </section>

      <section className="catalog-grid" aria-label="Fragancias">
        {errorCarga ? (
          <div className="empty-state" role="alert">{errorCarga}</div>
        ) : perfumesFiltrados.length ? perfumesFiltrados.map(perfume => (
          <ItemPerfume key={perfume.idPerfume} perfume={perfume} onSelect={onSelectPerfume} />
        )) : (
          <div className="empty-state">No se encontraron fragancias con esos criterios.</div>
        )}
      </section>
    </AppLayout>
  );
}
