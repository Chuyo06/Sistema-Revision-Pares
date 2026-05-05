/**
 * Cliente API global con soporte para timeouts y headers comunes.
 */

const DEFAULT_TIMEOUT = 10000; // 10 segundos

export async function apiFetch(endpoint, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, ...customOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const headers = { ...customOptions.headers };
  
  if (!(customOptions.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  // Agregar token si existe
  const user = JSON.parse(localStorage.getItem('rpp_usuario') || 'null');
  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }

  const config = {
    ...customOptions,
    headers,
    signal: controller.signal,
    cache: 'no-store', // Forzar red: evita caché HTTP y señala al SW que no use cache
  };

  try {
    const response = await fetch(endpoint, config);
    clearTimeout(id);

    if (response.status === 401) {
      // Opcional: manejar logout automático o refresh token
      console.warn('Sesión expirada o no autorizada');
    }

    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('La petición ha superado el tiempo de espera (Timeout)');
    }
    throw error;
  }
}
