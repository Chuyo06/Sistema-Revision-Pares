import { apiFetch } from './client.js'

const BASE_URL = '/api/notificaciones'

/**
 * Obtiene las notificaciones del usuario.
 */
export async function fetchNotificaciones(usuarioId) {
  if (!usuarioId) return []
  try {
    const res = await apiFetch(`${BASE_URL}/usuario/${usuarioId}`)
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    console.error('[API Notificaciones] Error fetching:', e)
    return []
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
    console.error('[API Notificaciones] Error marking as read:', e)
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
    console.error('[API Notificaciones] Error creating:', e)
    return false
  }
}
