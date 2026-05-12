import { apiFetch } from './client.js'

const BASE_URL = '/api/notificaciones'

/**
 * Obtiene las notificaciones del usuario.
 * Devuelve:
 *   - Array (posiblemente vacío) si el backend respondió OK.
 *   - null si hubo error de red, timeout, 4xx o 5xx (permite al caller
 *     distinguir "no hay datos" de "no se pudo consultar").
 */
export async function fetchNotificaciones(usuarioId) {
  if (!usuarioId) return []
  try {
    const res = await apiFetch(`${BASE_URL}/usuario/${usuarioId}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    // El cliente API ya emitió un warn de conectividad; aquí solo señalamos fallo.
    return null
  }
}

/**
 * Marca una notificación como leída.
 */
export async function marcarNotificacionLeida(id) {
  try {
    const res = await apiFetch(`${BASE_URL}/${id}/leida`, {
      method: 'PATCH'
    })
    return res.ok
  } catch (e) {
    console.warn('[Notificaciones] No se pudo marcar como leída:', e.message)
    return false
  }
}

/**
 * Crea una nueva notificación (persistente).
 */
export async function crearNotificacionApi(datos) {
  try {
    const res = await apiFetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(datos)
    })
    return res.ok
  } catch (e) {
    console.warn('[Notificaciones] No se pudo crear:', e.message)
    return false
  }
}
