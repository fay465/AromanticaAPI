const API_URL = 'http://localhost:5103/api/v1';

export const tiendaService = {
  getTiendas: async () => {
    let response;
    try {
      response = await fetch(`${API_URL}/tiendas`);
    } catch (error) {
      throw new Error(`No se pudo conectar con el servicio de tiendas: ${error.message}`);
    }

    if (!response.ok) {
      throw new Error(`Error al obtener tiendas (${response.status}).`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('El servicio de tiendas devolvió una respuesta inesperada.');
    return data;
  }
};
