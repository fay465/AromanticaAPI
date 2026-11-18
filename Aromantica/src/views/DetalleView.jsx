import React, { useEffect, useState } from 'react';
import { ofertaService } from '../services/ofertaService';
import { tiendaService } from '../services/tiendaService';
import AppLayout from '../components/AppLayout';

export default function DetalleView({ perfume, sesion, onLogout, onVolver, onIrAEditar, onIrAOferta, onEliminarPerfume }) {
  const [ofertasConTienda, setOfertasConTienda] = useState([]);
  const [errorOfertas, setErrorOfertas] = useState('');
  const [idConsultado, setIdConsultado] = useState(null);
  const [eliminandoPerfume, setEliminandoPerfume] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');
  const cargando = Boolean(perfume?.idPerfume && idConsultado !== perfume.idPerfume);
  const usuario = sesion?.usuario || sesion || {};
  const esAdmin = ['admin', 'administrador'].includes(String(usuario.rol || '').toLocaleLowerCase('es'));

  useEffect(() => {
    let activo = true;
    if (!perfume?.idPerfume) {
      return () => { activo = false; };
    }

    Promise.all([
      ofertaService.getOfertasPorPerfume(perfume.idPerfume),
      tiendaService.getTiendas()
    ])
      .then(([ofertas, tiendas]) => {
        if (!activo) return;
        const combinadas = ofertas.map(oferta => ({
          ...oferta,
          tienda: tiendas.find(t => Number(t.idTienda) === Number(oferta.idTienda))
            || { nombreComercial: 'Tienda desconocida', logoUrl: '' }
        }));
        setOfertasConTienda(combinadas);
        setErrorOfertas('');
      })
      .catch(error => {
        console.error('Error al cargar detalles y tiendas:', error);
        if (activo) {
          setOfertasConTienda([]);
          setErrorOfertas(error.message);
        }
      })
      .finally(() => {
        if (activo) setIdConsultado(perfume.idPerfume);
      });

    return () => { activo = false; };
  }, [perfume?.idPerfume]);

  const acordes = (perfume.acordesPredominantes || perfume.acordes || '')
    .split(/[;,]/).map(item => item.trim()).filter(Boolean);

  const handleEliminarPerfume = async () => {
    if (!window.confirm(`¿Eliminar "${perfume.nombre}" del catálogo? Esta acción no se puede deshacer.`)) return;
    setErrorEliminar('');
    setEliminandoPerfume(true);
    try {
      await onEliminarPerfume(perfume.idPerfume);
    } catch (error) {
      setErrorEliminar(error.message);
    } finally {
      setEliminandoPerfume(false);
    }
  };

  return (
    <AppLayout sesion={sesion} onLogout={onLogout}>
      <button className="back-link" type="button" onClick={onVolver}>
        <span className="material-symbols-outlined">arrow_back</span> Volver al catálogo
      </button>

      <section className="detail-layout">
        <div>
          <div className="detail-portrait">
            {perfume.imagenUrl && <img src={perfume.imagenUrl} alt={perfume.nombre} />}
            <span className="portrait-caption">{perfume.concentracion || 'Perfume'}</span>
          </div>
          <div className="editorial-note">
            <div className="eyebrow">Perfil de fragancia</div>
            <h3>{perfume.familiaOlfativa || perfume.familiasOlfativas || 'Composición aromática'}</h3>
            <p className="section-description">{perfume.descripcion || `Una composición de ${perfume.nombreMarca || perfume.marca || 'una marca independiente'}, seleccionada por su carácter y equilibrio.`}</p>
          </div>
        </div>

        <div className="detail-copy">
          <header>
            <div className="detail-meta">{perfume.nombreMarca || perfume.marca || 'Marca independiente'} · Concentración: {perfume.concentracion || 'Perfume'} · Género: {perfume.genero || 'Unisex'}</div>
            <h1 className="detail-title">{perfume.nombre}</h1>
            <p className="detail-description">{perfume.descripcion || `${perfume.nombre} es una creación de ${perfume.nombreMarca || perfume.marca || 'una marca independiente'}, definida por una estructura aromática distinguida y una presencia envolvente.`}</p>
          </header>

          <div className="metric-grid">
            <div className="metric-card"><small>Duración / fijación</small><strong>{perfume.duracion || 'Sin información'}</strong></div>
            <div className="metric-card"><small>Estela / proyección</small><strong>{perfume.estela || 'Sin información'}</strong></div>
          </div>

          <section className="olfactive-card">
            <div className="olfactive-heading"><span>✿ Estructura olfativa</span><span>{perfume.familiaOlfativa || perfume.familiasOlfativas || 'Perfil aromático'}</span></div>
            <div className="olfactive-section">
              <small>Notas de salida · Tête</small>
              <div className="tag-list">
                {(perfume.notasSalida || perfume.notas || '').split(/[;,]/).map(item => item.trim()).filter(Boolean).map(nota => <span className="tag" key={nota}>{nota}</span>)}
                {!(perfume.notasSalida || perfume.notas) && <span className="tag">Sin notas registradas</span>}
              </div>
            </div>
            <div className="detail-columns">
              <div className="olfactive-section"><small>Notas de corazón · Cœur</small><p className="section-description">La armonía central de la composición.</p></div>
              <div className="olfactive-section"><small>Notas de fondo · Fond</small><p className="section-description">Una estela que permanece en la piel.</p></div>
            </div>
            <div className="olfactive-section">
              <small>Acordes predominantes</small>
              <div className="tag-list">{acordes.length ? acordes.map(acorde => <span className="tag" key={acorde}>• {acorde}</span>) : <span className="tag">Sin acordes registrados</span>}</div>
            </div>
          </section>
        </div>
      </section>

      <section className="offers-section">
        <div className="section-heading-row">
          <div>
            <div className="eyebrow">Mercado &amp; disponibilidad</div>
            <h2 className="section-title">Tiendas y Ofertas Disponibles</h2>
            <p className="section-description">Cotizador en tiempo real con paridad cambiaria en pesos chilenos (CLP).</p>
          </div>
          <span className="tag">{cargando ? 'Consultando ofertas...' : `${ofertasConTienda.length} cotizaciones`}</span>
        </div>
        {errorOfertas ? <p className="form-alert" role="alert">{errorOfertas}</p> : cargando ? <p className="section-description">Cargando tiendas y precios...</p> : ofertasConTienda.length === 0 ? (
          <div className="empty-state">No hay ofertas registradas para este perfume en ninguna tienda.</div>
        ) : (
          <div className="offer-list">
            {ofertasConTienda.map(item => (
              <article className="offer-row" key={item.idOferta}>
                <div className="offer-store">
                  <span className="store-logo">{item.tienda.logoUrl ? <img src={item.tienda.logoUrl} alt="" /> : (item.tienda.nombreComercial || 'T').charAt(0)}</span>
                  <span><strong>{item.tienda.nombreComercial}</strong><small>{item.tienda.tipoComercio || 'Retail oficial'}</small></span>
                </div>
                <div className="offer-info offer-format"><small>Formato</small><strong>{item.formatoMl} ml</strong></div>
                <div className="offer-info offer-stock"><small>Disponibilidad</small><strong className={item.stockDisponible ? 'stock-available' : 'stock-unavailable'}>{item.stockDisponible ? '● Disponible' : '● Agotado'}</strong></div>
                <div className="offer-info offer-delivery"><small>Entrega</small><strong>Consultar tienda</strong></div>
                <div className="offer-info offer-buy">
                  <small>Precio final</small>
                  <strong className="offer-price">${Number(item.precioClp).toLocaleString('es-CL')} CLP</strong>
                  {item.stockDisponible && item.urlCompra && <a className="offer-purchase-link" href={item.urlCompra} target="_blank" rel="noopener noreferrer">Ir a la tienda ↗</a>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {esAdmin && (
        <section className="admin-panel">
          <div><div className="eyebrow">Panel de Administrador</div><p className="section-description">Gestión curatorial de la referencia olfativa y sus cotizaciones.</p></div>
          <div className="admin-actions">
            <button className="secondary-button" type="button" onClick={onIrAEditar}>Modificar perfume</button>
            <button className="secondary-button" type="button" onClick={onIrAOferta}>Modificar ofertas</button>
            <button className="danger-button" type="button" onClick={handleEliminarPerfume} disabled={eliminandoPerfume}>
              {eliminandoPerfume ? 'Eliminando...' : 'Eliminar perfume'}
            </button>
            {errorEliminar && <p className="form-alert" role="alert">{errorEliminar}</p>}
          </div>
        </section>
      )}
    </AppLayout>
  );
}
