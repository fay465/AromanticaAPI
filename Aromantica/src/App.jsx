import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import CatalogoView from './views/CatalogoView';
import DetalleView from './views/DetalleView';
import EditarPerfumeView from './views/EditarPerfumeView';
import EditarOfertaView from './views/EditarOfertaView';
import { perfumeService } from './services/perfumeService';

export default function App() {
  const [vistaActual, setVistaActual] = useState('login');
  const [sesion, setSesion] = useState(null);
  const [perfumes, setPerfumes] = useState([]);
  const [perfumeSeleccionado, setPerfumeSeleccionado] = useState(null);
  const [errorCatalogo, setErrorCatalogo] = useState('');

  useEffect(() => {
    if (!sesion) return undefined;
    let activo = true;
    perfumeService.getAll()
      .then(data => {
        if (!activo) return;
        setPerfumes(data);
        setErrorCatalogo('');
      })
      .catch(error => {
        if (!activo) return;
        console.error('Error al cargar perfumes:', error);
        setErrorCatalogo(error.message);
      });

    return () => { activo = false; };
  }, [sesion]);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setSesion(null);
    setVistaActual('login');
    setPerfumeSeleccionado(null);
  };

  const guardarPerfumeEditado = async (datosPerfume, perfumeActualizado) => {
    await perfumeService.update(datosPerfume.idPerfume, datosPerfume, sesion.token);
    setPerfumes(actuales => actuales.map(item => (
      Number(item.idPerfume) === Number(datosPerfume.idPerfume) ? perfumeActualizado : item
    )));
    setPerfumeSeleccionado(perfumeActualizado);
    setVistaActual('detalle');
  };

  const crearPerfume = async (datosPerfume, nuevoPerfume) => {
    const creado = await perfumeService.create(datosPerfume, sesion.token);
    const perfumeGuardado = {
      ...nuevoPerfume,
      ...creado,
      idPerfume: creado?.idPerfume ?? creado?.IdPerfume
    };
    if (!perfumeGuardado.idPerfume) {
      throw new Error('El catálogo no devolvió el identificador del perfume creado.');
    }
    setPerfumes(actuales => [...actuales, perfumeGuardado]);
    setPerfumeSeleccionado(perfumeGuardado);
    setVistaActual('detalle');
  };

  const eliminarPerfume = async (idPerfume) => {
    await perfumeService.delete(idPerfume, sesion.token);
    setPerfumes(actuales => actuales.filter(item => Number(item.idPerfume) !== Number(idPerfume)));
    setPerfumeSeleccionado(null);
    setVistaActual('catalogo');
  };

  if (!sesion) {
    return (
      vistaActual === 'login' ? (
        <Login
          onLoginSuccess={(userData) => {
            setSesion(userData);
            setVistaActual('catalogo');
          }}
          irARegistro={() => setVistaActual('register')}
        />
      ) : (
        <Register irALogin={() => setVistaActual('login')} />
      )
    );
  }

  // Creación y edición de perfumes
  if ((vistaActual === 'editar' && perfumeSeleccionado) || vistaActual === 'crear') {
    return (
      <EditarPerfumeView
        perfume={perfumeSeleccionado}
        esNuevo={vistaActual === 'crear'}
        sesion={sesion}
        onLogout={cerrarSesion}
        onVolver={() => setVistaActual(vistaActual === 'crear' ? 'catalogo' : 'detalle')}
        onGuardarCambios={guardarPerfumeEditado}
        onCrearPerfume={crearPerfume}
      />
    );
  }
  if (vistaActual === 'ofertaEditar' && perfumeSeleccionado) {
    return (
      <EditarOfertaView 
        perfume={perfumeSeleccionado}
        sesion={sesion}
        onLogout={cerrarSesion}
        onVolver={() => setVistaActual('detalle')}
      />
    );
  }

  if (vistaActual === 'detalle' && perfumeSeleccionado) {
    return (
      <DetalleView 
        perfume={perfumeSeleccionado} 
        sesion={sesion} 
        onLogout={cerrarSesion}
        onVolver={() => setVistaActual('catalogo')}
        onIrAEditar={() => setVistaActual('editar')}
        onIrAOferta={() => setVistaActual('ofertaEditar')}
        onEliminarPerfume={eliminarPerfume}
      />
    );
  }

  return (
    <CatalogoView 
      sesion={sesion} 
      perfumes={perfumes} 
      errorCarga={errorCatalogo}
      onSelectPerfume={(perfume) => {
        setPerfumeSeleccionado(perfume);
        setVistaActual('detalle');
      }} 
      onCrearPerfume={() => {
        setPerfumeSeleccionado(null);
        setVistaActual('crear');
      }}
      onLogout={cerrarSesion}
    />
  );
}
