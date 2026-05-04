import { apiFetch } from './client.js'

const BASE_URL = '/api/notificaciones'

export async function fetchNotificaciones() {
  try {
    const res = await apiFetch(BASE_URL)
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export async function marcarNotificacionLeida(id) {
  try {
    const res = await apiFetch(`${BASE_URL}/${id}/leer`, {
      method: 'PATCH'
    })
    return res.ok
  } catch {
    return false
  }
}

export async function crearNotificacionApi(datos) {
  try {
    const res = await apiFetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(datos)
    })
    return res.ok
  } catch {
    return false
  }
}
