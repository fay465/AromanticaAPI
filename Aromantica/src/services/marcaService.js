const API_URL = 'http://localhost:5102/api/v1';

export const marcaService = {
  getAll: async () => {
    let response;
    try {
      response = await fetch(`${API_URL}/marcas`);
    } catch (error) {
      throw new Error(`No se pudo conectar con el servicio de marcas: ${error.message}`);
    }

    if (!response.ok) {
      throw new Error(`Error al obtener marcas (${response.status}).`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('El servicio de marcas devolvió una respuesta inesperada.');
    return data;
  }
};
