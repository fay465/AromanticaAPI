import React, { useEffect, useState } from 'react';
import { ofertaService } from '../services/ofertaService';
import { tiendaService } from '../services/tiendaService';
import AppLayout from '../components/AppLayout';

const formularioVacio = {
  idTienda: '',
  precioClp: '',
  formatoMl: '',
  stockDisponible: true,
  urlCompra: ''
};

export default function EditarOfertaView({ perfume, sesion, onLogout, onVolver }) {
  const [ofertas, setOfertas] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [idConsultado, setIdConsultado] = useState(null);
  const cargando = Boolean(perfume?.idPerfume && idConsultado !== perfume.idPerfume);
  const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);
  const [idOfertaEditando, setIdOfertaEditando] = useState(null);
  const [formOferta, setFormOferta] = useState(formularioVacio);
  const [guardando, setGuardando] = useState(false);
  const [idOfertaEliminando, setIdOfertaEliminando] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let activo = true;
    if (!perfume?.idPerfume) {
      return () => { activo = false; };
    }

    Promise.all([
      ofertaService.getOfertasPorPerfume(perfume.idPerfume),
      tiendaService.getTiendas()
    ])
      .then(([dataOfertas, dataTiendas]) => {
        if (!activo) return;
        setOfertas(Array.isArray(dataOfertas) ? dataOfertas : []);
        setTiendas(Array.isArray(dataTiendas) ? dataTiendas : []);
        setError('');
      })
      .catch(error => {
        console.error('Error cargando datos de ofertas:', error);
        if (activo) {
          setOfertas([]);
          setTiendas([]);
          setError(error.message);
        }
      })
      .finally(() => {
        if (activo) setIdConsultado(perfume.idPerfume);
      });

    return () => { activo = false; };
  }, [perfume?.idPerfume]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormOferta(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const abrirCrear = () => {
    setIdOfertaEditando(null);
    setFormOferta({ ...formularioVacio });
    setMostrarFormularioCrear(true);
  };

  const abrirEditar = (oferta) => {
    setMostrarFormularioCrear(false);
    setIdOfertaEditando(oferta.idOferta);
    setFormOferta({
      idTienda: oferta.idTienda,
      precioClp: oferta.precioClp,
      formatoMl: oferta.formatoMl,
      stockDisponible: oferta.stockDisponible,
      urlCompra: oferta.urlCompra || ''
    });
  };

  const cerrarFormulario = () => {
    setMostrarFormularioCrear(false);
    setIdOfertaEditando(null);
    setFormOferta({ ...formularioVacio });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setGuardando(true);
    const payload = {
      idOferta: idOfertaEditando || 0,
      idPerfume: perfume.idPerfume,
      idTienda: Number(formOferta.idTienda),
      precioClp: Number(formOferta.precioClp),
      formatoMl: Number(formOferta.formatoMl),
      stockDisponible: formOferta.stockDisponible,
      urlCompra: formOferta.urlCompra.trim(),
      fechaActualizacion: new Date().toISOString().split('T')[0]
    };

    try {
      if (idOfertaEditando) {
        await ofertaService.update(idOfertaEditando, payload, sesion?.token);
        setOfertas(actuales => actuales.map(oferta => (
          Number(oferta.idOferta) === Number(idOfertaEditando) ? payload : oferta
        )));
        setMensaje('La oferta se actualizó correctamente.');
      } else {
        const creada = await ofertaService.create(payload, sesion?.token);
        const idCreada = creada?.idOferta ?? creada?.IdOferta;
        if (!idCreada) throw new Error('El servicio no devolvió el identificador de la oferta creada.');
        setOfertas(actuales => [...actuales, { ...payload, ...creada, idOferta: idCreada }]);
        setMensaje('La oferta se creó correctamente.');
      }
      cerrarFormulario();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (oferta) => {
    if (!window.confirm(`¿Eliminar la oferta Nº ${oferta.idOferta}? Esta acción no se puede deshacer.`)) return;
    setError('');
    setMensaje('');
    setIdOfertaEliminando(oferta.idOferta);
    try {
      await ofertaService.delete(oferta.idOferta, sesion?.token);
      setOfertas(actuales => actuales.filter(item => Number(item.idOferta) !== Number(oferta.idOferta)));
      if (Number(idOfertaEditando) === Number(oferta.idOferta)) cerrarFormulario();
      setMensaje('La oferta se eliminó correctamente.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIdOfertaEliminando(null);
    }
  };

  const renderFormulario = (modo) => (
    <form className="offer-form-card" onSubmit={handleGuardar}>
      <h3>{modo === 'editar' ? `Editar cotización Nº ${idOfertaEditando}` : 'Nueva Oferta / Cotización'}</h3>
      <div className="form-grid">
        <label className="field">
          <span className="field-label">Tienda</span>
          <select className="field-select" name="idTienda" value={formOferta.idTienda} onChange={handleChange} required>
            <option value="">Seleccione una tienda</option>
            {tiendas.map(tienda => <option key={tienda.idTienda} value={tienda.idTienda}>{tienda.nombreComercial} ({tienda.tipoComercio})</option>)}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Precio (CLP)</span>
          <input className="field-input" type="number" name="precioClp" min="1" step="1" value={formOferta.precioClp} onChange={handleChange} placeholder="115000" required />
        </label>
        <label className="field">
          <span className="field-label">Formato (ml)</span>
          <input className="field-input" type="number" name="formatoMl" min="1" max="1000" step="1" value={formOferta.formatoMl} onChange={handleChange} placeholder="100" required />
        </label>
        <label className="field">
          <span className="field-label">URL de compra</span>
          <input className="field-input" type="url" name="urlCompra" value={formOferta.urlCompra} onChange={handleChange} placeholder="https://..." required />
        </label>
        <label className="form-checkbox">
          <input type="checkbox" name="stockDisponible" checked={formOferta.stockDisponible} onChange={handleChange} />
          Stock disponible
        </label>
      </div>
      <div className="admin-actions">
        <button className="secondary-button" type="button" onClick={cerrarFormulario} disabled={guardando}>Cancelar</button>
        <button className="primary-button" type="submit" disabled={guardando || tiendas.length === 0}>
          {guardando ? 'Guardando...' : modo === 'editar' ? 'Actualizar oferta' : 'Guardar nueva oferta'}
        </button>
      </div>
    </form>
  );

  return (
    <AppLayout sesion={sesion} onLogout={onLogout}>
      <button className="back-link" type="button" onClick={onVolver}>
        <span className="material-symbols-outlined">arrow_back</span> Volver a detalles
      </button>
      <div className="offer-manager-layout">
        <aside className="offer-perfume-summary">
          <div className="eyebrow">Referencia curatorial · Nº {perfume.idPerfume}</div>
          <div className="offer-perfume-image">
            {perfume.imagenUrl && <img src={perfume.imagenUrl} alt={perfume.nombre} />}
          </div>
          <h2>{perfume.nombre}</h2>
          <p>{perfume.nombreMarca || perfume.marca} · {perfume.concentracion}</p>
        </aside>

        <section className="manager-content">
          <header className="manager-header">
            <div>
              <div className="page-kicker">Mercado &amp; cotizaciones</div>
              <h1 className="page-title">Gestión de Cotizaciones y Ofertas</h1>
              <p className="page-subtitle">Administre disponibilidad y precios para esta fragancia.</p>
            </div>
            {!mostrarFormularioCrear && idOfertaEditando === null && (
              <button className="primary-button" type="button" onClick={abrirCrear}>
                <span className="material-symbols-outlined">add</span> Añadir oferta
              </button>
            )}
          </header>

          <div className="section-heading-row">
            <div><h2 className="section-title">Ofertas y Precios Registrados</h2><p className="section-description">{ofertas.length} cotizaciones vinculadas</p></div>
          </div>

          {error && <p className="form-alert" role="alert">{error}</p>}
          {mensaje && <p className="auth-feedback" role="status">{mensaje}</p>}
          {cargando ? <p className="section-description">Cargando precios y tiendas...</p> : ofertas.length === 0 ? (
            <div className="empty-state">No hay ofertas registradas para este perfume.</div>
          ) : (
            <div className="manager-list">
              {ofertas.map(oferta => {
                const tienda = tiendas.find(item => Number(item.idTienda) === Number(oferta.idTienda));
                const estaEditando = idOfertaEditando === oferta.idOferta;
                return (
                  <article className="manager-offer" key={oferta.idOferta}>
                    <div className="manager-offer-top">
                      <div className="offer-store">
                        <span className="store-logo">{tienda?.logoUrl ? <img src={tienda.logoUrl} alt="" /> : (tienda?.nombreComercial || 'T').charAt(0)}</span>
                        <span><strong>{tienda?.nombreComercial || `Tienda ID: ${oferta.idTienda}`}</strong><small>{tienda?.tipoComercio || 'Cotización de mercado'}</small></span>
                      </div>
                      <div className="manager-offer-actions">
                        <button className="icon-button" type="button" title="Editar oferta" aria-label="Editar oferta" disabled={idOfertaEliminando !== null} onClick={() => abrirEditar(oferta)}><span className="material-symbols-outlined">edit</span></button>
                        <button className="icon-button" type="button" title="Borrar oferta" aria-label="Borrar oferta" disabled={idOfertaEliminando !== null} onClick={() => handleEliminar(oferta)}>
                          <span className="material-symbols-outlined">{Number(idOfertaEliminando) === Number(oferta.idOferta) ? 'progress_activity' : 'delete'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="manager-offer-details">
                      <span>Formato: <strong>{oferta.formatoMl} ml</strong></span>
                      <span>Precio: <strong>${Number(oferta.precioClp).toLocaleString('es-CL')} CLP</strong></span>
                      <span>Stock: <strong className={oferta.stockDisponible ? 'stock-available' : 'stock-unavailable'}>{oferta.stockDisponible ? 'Disponible' : 'Agotado'}</strong></span>
                      {oferta.urlCompra && <a href={oferta.urlCompra} target="_blank" rel="noopener noreferrer">Abrir tienda ↗</a>}
                    </div>
                    {estaEditando && renderFormulario('editar')}
                  </article>
                );
              })}
            </div>
          )}

          {mostrarFormularioCrear && renderFormulario('crear')}
        </section>
      </div>
    </AppLayout>
  );
}
