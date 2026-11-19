const API_URL = 'http://localhost:5102/api/v1';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (error) {
    throw new Error(`No se pudo conectar con el catálogo de perfumes: ${error.message}`);
  }

  if (!response.ok) {
    let problem;
    try {
      problem = await response.json();
    } catch {
      problem = null;
    }
    throw new Error(problem?.detail || problem?.title || `Error del catálogo (${response.status}).`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function headersConToken(token) {
  if (!token) throw new Error('Tu sesión expiró. Inicia sesión nuevamente para modificar perfumes.');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export const perfumeService = {
  getAll: async () => {
    const data = await request('/perfumes');
    if (!Array.isArray(data)) throw new Error('El catálogo devolvió una respuesta inesperada al listar perfumes.');
    return data;
  },

  create: async (perfume, token) => request('/perfumes', {
    method: 'POST',
    headers: headersConToken(token),
    body: JSON.stringify(perfume)
  }),

  update: async (id, perfume, token) => request(`/perfumes/${id}`, {
    method: 'PUT',
    headers: headersConToken(token),
    body: JSON.stringify(perfume)
  }),

  delete: async (id, token) => request(`/perfumes/${id}`, {
    method: 'DELETE',
    headers: headersConToken(token)
  })
};
