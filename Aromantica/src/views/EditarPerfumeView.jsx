import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { marcaService } from '../services/marcaService';

const baseConcentraciones = ['EDP', 'EDT', 'Parfum', 'EDC', 'Eau de Parfum (EDP)', 'Eau de Toilette (EDT)', 'Elixir'];
const baseGeneros = ['Masculino', 'Femenino', 'Unisex'];
const baseFamilias = ['Almizcle', 'Amaderado', 'Amaderada', 'Floral', 'Oriental', 'Cítrica', 'Fougère', 'Frutal', 'Especiada', 'Acuática'];
const baseAcordes = ['Marino', 'Afrutados', 'Cítrico', 'Salado', 'Ozónico', 'Amaderado', 'Avainillado', 'Especiado cálido', 'Atalcado', 'Dulce', 'Fresco', 'Almizclado'];
const baseNotas = ['Notas marinas', 'Frutos rojos', 'Bergamota', 'Limón', 'Lavanda', 'Menta', 'Manzana', 'Mandarina', 'Rosa', 'Pimienta'];
const baseDuraciones = ['Duradera (8 a 10 horas)', 'Duradera (6-8h)', 'Muy duradera (+8h)', 'Moderada (3-5h)', 'Eterno (+12h)'];
const baseEstelas = ['Moderada a Fuerte', 'Alta / Pesada', 'Moderada', 'Íntima / Suave', 'Enorme'];
const MAX_FAMILIAS = 3;
const MAX_ACORDES = 6;
const MAX_NOTAS_SALIDA = 3;

function dividirLista(texto = '') {
  return String(texto).split(/[;,]/).map(item => item.trim()).filter(Boolean);
}

function crearFormulario(perfume) {
  const familias = dividirLista(perfume?.familiaOlfativa);
  const acordes = dividirLista(perfume?.acordesPredominantes);
  const notasSalida = dividirLista(perfume?.notasSalida);
  return {
    nombre: perfume?.nombre || '',
    idMarca: perfume?.idMarca ?? '',
    concentracion: perfume?.concentracion || '',
    genero: perfume?.genero || '',
    familiaOlfativa1: familias[0] || '',
    familiaOlfativa2: familias[1] || '',
    familiaOlfativa3: familias[2] || '',
    acorde1: acordes[0] || '',
    acorde2: acordes[1] || '',
    acorde3: acordes[2] || '',
    acorde4: acordes[3] || '',
    acorde5: acordes[4] || '',
    acorde6: acordes[5] || '',
    notaSalida1: notasSalida[0] || '',
    notaSalida2: notasSalida[1] || '',
    notaSalida3: notasSalida[2] || '',
    notasCorazon: perfume?.notasCorazon || '',
    notasFondo: perfume?.notasFondo || '',
    duracion: perfume?.duracion || '',
    estela: perfume?.estela || '',
    imagenUrl: perfume?.imagenUrl || ''
  };
}

function obtenerOpcionesConActual(listaBase, valorActual) {
  if (valorActual && !listaBase.includes(valorActual)) return [valorActual, ...listaBase];
  return listaBase;
}

export default function EditarPerfumeView({
  perfume,
  esNuevo = false,
  sesion,
  onLogout,
  onVolver,
  onGuardarCambios,
  onCrearPerfume
}) {
  const [formData, setFormData] = useState(() => crearFormulario(perfume));
  const [marcas, setMarcas] = useState([]);
  const [cargandoMarcas, setCargandoMarcas] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    marcaService.getAll()
      .then(data => {
        if (activo) setMarcas(data);
      })
      .catch(err => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setCargandoMarcas(false);
      });

    return () => { activo = false; };
  }, []);

  const handleChange = (e) => {
    setFormData(current => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    const lista = (prefijo, cantidad) => Array.from(
      { length: cantidad },
      (_, index) => formData[`${prefijo}${index + 1}`]
    ).filter(Boolean).join(', ');

    const payload = {
      idPerfume: perfume?.idPerfume || 0,
      nombre: formData.nombre.trim(),
      idMarca: Number(formData.idMarca),
      concentracion: formData.concentracion,
      genero: formData.genero,
      familiaOlfativa: lista('familiaOlfativa', MAX_FAMILIAS),
      acordesPredominantes: lista('acorde', MAX_ACORDES),
      notasSalida: lista('notaSalida', MAX_NOTAS_SALIDA),
      notasCorazon: formData.notasCorazon.trim(),
      notasFondo: formData.notasFondo.trim(),
      duracion: formData.duracion,
      estela: formData.estela,
      imagenUrl: formData.imagenUrl.trim() || null
    };

    const nombreMarca = marcas.find(marca => Number(marca.idMarca) === payload.idMarca)?.nombre;
    const perfumeEditado = { ...perfume, ...payload, nombreMarca };

    try {
      if (esNuevo) {
        await onCrearPerfume(payload, perfumeEditado);
      } else {
        await onGuardarCambios(payload, perfumeEditado);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const campoSelect = (name, label, opciones, placeholder, required = false) => (
    <label className="field" key={name}>
      <span className="field-label">{label}</span>
      <select className="field-select" name={name} value={formData[name]} onChange={handleChange} required={required}>
        <option value="">{placeholder}</option>
        {obtenerOpcionesConActual(opciones, formData[name]).map(opcion => <option key={opcion} value={opcion}>{opcion}</option>)}
      </select>
    </label>
  );

  return (
    <AppLayout sesion={sesion} onLogout={onLogout}>
      <button className="back-link" type="button" onClick={onVolver}>
        <span className="material-symbols-outlined">arrow_back</span> Volver a detalles
      </button>
      <header className="editor-heading">
        <div>
          <div className="page-kicker">Aromántica · {esNuevo ? 'Nueva fragancia' : `Registro Nº ${perfume.idPerfume}`}</div>
          <h1 className="page-title">{esNuevo ? 'Añadir perfume' : 'Editar perfume'}</h1>
        </div>
        <span className="tag">{esNuevo ? '● Nueva ficha' : '● Modo edición activo'}</span>
      </header>

      <div className="editor-layout">
        <aside>
          <div className="editor-preview">
            <div className="eyebrow">Ficha de fragancia</div>
            <div className="editor-preview-image">
              {formData.imagenUrl ? <img src={formData.imagenUrl} alt={formData.nombre} /> : <span className="material-symbols-outlined">imagesmode</span>}
            </div>
            <h2>{formData.nombre || 'Nueva fragancia'}</h2>
            <p>{marcas.find(marca => Number(marca.idMarca) === Number(formData.idMarca))?.nombre || 'Marca'} · {formData.concentracion || 'Concentración'}</p>
            <div className="olfactive-section">
              <small>Notas de salida</small>
              <div className="tag-list">
                {[formData.notaSalida1, formData.notaSalida2, formData.notaSalida3].filter(Boolean).map(nota => <span className="tag" key={nota}>{nota}</span>)}
              </div>
            </div>
          </div>
          <div className="editorial-note"><div className="eyebrow">Consejo de edición</div><p className="section-description">Mantén las notas y acordes de la fragancia actualizados para ofrecer una ficha clara y completa.</p></div>
        </aside>

        <form className="editor-form" onSubmit={handleSubmit}>
          <section className="editor-section">
            <div className="editor-section-heading"><h2>01. Información básica</h2><small>Identidad &amp; concentración</small></div>
            <div className="form-grid">
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span className="field-label">Nombre de la fragancia *</span>
                <input className="field-input" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </label>
              <label className="field">
                <span className="field-label">Marca *</span>
                <select className="field-select" name="idMarca" value={formData.idMarca} onChange={handleChange} required disabled={cargandoMarcas || marcas.length === 0}>
                  <option value="">{cargandoMarcas ? 'Cargando marcas...' : 'Seleccione una marca'}</option>
                  {formData.idMarca && !marcas.some(marca => Number(marca.idMarca) === Number(formData.idMarca)) && (
                    <option value={formData.idMarca}>{perfume?.nombreMarca || `Marca ${formData.idMarca}`}</option>
                  )}
                  {marcas.map(marca => <option key={marca.idMarca} value={marca.idMarca}>{marca.nombre}</option>)}
                </select>
              </label>
              {campoSelect('concentracion', 'Concentración *', baseConcentraciones, 'Seleccione concentración', true)}
              {campoSelect('genero', 'Género *', baseGeneros, 'Seleccione género', true)}
              {error && <p className="form-alert" role="alert">{error}</p>}
              {!cargandoMarcas && marcas.length === 0 && <p className="form-alert" role="alert">No hay marcas disponibles; no se puede guardar una fragancia sin marca.</p>}
            </div>
          </section>

          <section className="editor-section">
            <div className="editor-section-heading"><h2>02. Familias olfativas</h2><small>Hasta tres familias</small></div>
            <div className="form-grid three">
              {[1, 2, 3].map(num => campoSelect(`familiaOlfativa${num}`, `Familia ${num}`, baseFamilias, `Seleccione familia ${num}`))}
            </div>
          </section>

          <section className="editor-section">
            <div className="editor-section-heading"><h2>03. Acordes predominantes</h2><small>Hasta seis acordes</small></div>
            <div className="form-grid three">
              {[1, 2, 3, 4, 5, 6].map(num => campoSelect(`acorde${num}`, `Acorde ${num}`, baseAcordes, `Seleccione acorde ${num}`))}
            </div>
          </section>

          <section className="editor-section">
            <div className="editor-section-heading"><h2>04. Notas</h2><small>Salida, corazón y fondo</small></div>
            <div className="form-grid three">
              {[1, 2, 3].map(num => campoSelect(`notaSalida${num}`, `Nota de salida ${num}`, baseNotas, `Seleccione nota ${num}`))}
            </div>
            <div className="form-grid">
              <label className="field">
                <span className="field-label">Notas de corazón</span>
                <input className="field-input" name="notasCorazon" value={formData.notasCorazon} onChange={handleChange} placeholder="Ej: rosa, jazmín" />
              </label>
              <label className="field">
                <span className="field-label">Notas de fondo</span>
                <input className="field-input" name="notasFondo" value={formData.notasFondo} onChange={handleChange} placeholder="Ej: vainilla, cedro" />
              </label>
            </div>
          </section>

          <section className="editor-section">
            <div className="editor-section-heading"><h2>05. Duración e imagen</h2><small>Rendimiento &amp; referencia</small></div>
            <div className="form-grid">
              {campoSelect('duracion', 'Duración', baseDuraciones, 'Seleccione duración')}
              {campoSelect('estela', 'Estela', baseEstelas, 'Seleccione estela')}
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span className="field-label">URL de imagen</span>
                <input className="field-input" type="url" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="https://..." />
              </label>
            </div>
          </section>

          <div className="editor-actions">
            <span className="action-note">Los cambios se guardarán en el catálogo.</span>
            <button className="secondary-button" type="button" onClick={onVolver} disabled={guardando}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={guardando || cargandoMarcas || marcas.length === 0}>
              {guardando ? 'Guardando...' : esNuevo ? 'Crear perfume' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
