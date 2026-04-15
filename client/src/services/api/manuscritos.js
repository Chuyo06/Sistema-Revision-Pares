// ─────────────────────────────────────────────────────────────
// Servicio de manuscritos
//
// Proxy definido en vite.config.js → http://localhost:3002
// Fallback: no modifica los datos mock de los stores Pinia.
// ─────────────────────────────────────────────────────────────

const BASE_URL = '/api/manuscritos'

/**
 * Obtiene el token JWT guardado (si existe).
 */
function authHeaders() {
  const raw = localStorage.getItem('rpp_usuario')
  const usuario = raw ? JSON.parse(raw) : null
  const headers = { 'Content-Type': 'application/json' }
  if (usuario?.token) {
    headers['Authorization'] = `Bearer ${usuario.token}`
  }
  return headers
}

/**
 * Obtener todos los manuscritos del backend.
 * @returns {Promise<Array|null>} null si el backend no responde (usar mock)
 */
export async function fetchManuscritos() {
  try {
    const res = await fetch(BASE_URL, { headers: authHeaders() })
    if (!res.ok) return null
    return await res.json()
  } catch {
    console.warn('[Manuscritos] Backend no disponible, usando datos mock')
    return null
  }
}

/**
 * Obtener manuscritos por autor.
 * @returns {Promise<Array|null>}
 */
export async function fetchManuscritosPorAutor(autorId) {
  try {
    const res = await fetch(`${BASE_URL}/autor/${autorId}`, { headers: authHeaders() })
    if (!res.ok) return null
    return await res.json()
  } catch {
    console.warn('[Manuscritos] Backend no disponible')
    return null
  }
}

/**
 * Actualizar estado de un manuscrito.
 */
export async function actualizarEstadoManuscrito(id, estado) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ estado }),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Crear un manuscrito en el backend.
 * @returns {Promise<Object|null>} null si el backend no responde
 */
export async function crearManuscrito(datos) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(datos),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Error al crear manuscrito')
    }
    return await res.json()
  } catch (err) {
    if (err.message && err.message !== 'Failed to fetch') {
      throw err
    }
    console.warn('[Manuscritos] Backend no disponible, guardando solo en mock')
    return null
  }
}
