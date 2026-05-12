/**
 * Cliente API global con soporte para timeouts y headers comunes.
 *
 * Política de logging:
 *  - 2xx → silencioso.
 *  - 4xx → silencioso. Cada service decide si es un error real o un caso
 *          esperable (p.ej. 404 de un recurso opcional, 401 al cerrar sesión).
 *          El navegador ya muestra "Failed to load resource" en Network — no
 *          duplicamos ese ruido en la consola.
 *  - 5xx → console.error (errores reales del servidor que el equipo debe ver).
 *  - 401 → console.warn una sola vez (sesión expirada).
 *  - Network/timeout → console.warn (problema de conectividad, no del servidor).
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

    // Solo registramos errores 5xx (problemas reales del servidor).
    // 4xx (incluido 404 y 401) son responsabilidad del caller decidir.
    if (response.status >= 500) {
      console.error(`[API] ${response.status} ${response.statusText} en ${endpoint}`);
    } else if (response.status === 401) {
      console.warn('[API] Sesión expirada o no autorizada.');
    }

    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      console.warn(`[API] Timeout en ${endpoint} (${timeout}ms)`);
      throw new Error('La petición ha superado el tiempo de espera (Timeout)');
    }
    // Error de red / backend caído: no inundamos consola, los stores ya manejan fallback.
    console.warn(`[API] Sin conexión a ${endpoint}: ${error.message}`);
    throw error;
  }
}
