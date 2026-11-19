const API_URL = 'http://localhost:5104/api/v1';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (error) {
    throw new Error(`No se pudo conectar con el servicio de cotizaciones: ${error.message}`);
  }

  if (!response.ok) {
    let problem;
    try {
      problem = await response.json();
    } catch {
      problem = null;
    }
    throw new Error(problem?.detail || problem?.title || `Error de cotizaciones (${response.status}).`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function headersConToken(token) {
  if (!token) throw new Error('Tu sesión expiró. Inicia sesión nuevamente para modificar cotizaciones.');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export const ofertaService = {
  getOfertasPorPerfume: async (idPerfume) => {
    const data = await request(`/cotizaciones?idPerfume=${encodeURIComponent(idPerfume)}`);
    if (!Array.isArray(data)) throw new Error('El servicio de cotizaciones devolvió una respuesta inesperada.');
    return data;
  },

  create: async (oferta, token) => request('/cotizaciones', {
    method: 'POST',
    headers: headersConToken(token),
    body: JSON.stringify(oferta)
  }),

  update: async (id, oferta, token) => request(`/cotizaciones/${id}`, {
    method: 'PUT',
    headers: headersConToken(token),
    body: JSON.stringify(oferta)
  }),

  delete: async (id, token) => request(`/cotizaciones/${id}`, {
    method: 'DELETE',
    headers: headersConToken(token)
  })
};
