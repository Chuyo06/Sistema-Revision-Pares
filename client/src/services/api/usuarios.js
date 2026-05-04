import { apiFetch } from './client.js'

const BASE_URL = '/api/usuarios'

export async function fetchUsuarios() {
  try {
    const res = await apiFetch(BASE_URL)
    if (!res.ok) {
      console.warn('[Usuarios] Error HTTP:', res.status)
      return []
    }
    return await res.json()
  } catch (err) {
    console.error('[Usuarios] Excepción en fetchUsuarios:', err)
    return []
  }
}

export async function toggleEstadoUsuarioApi(id, estadoActual) {
  const nuevoEstado = estadoActual === 'activo' ? 'INACTIVO' : 'ACTIVO'
  try {
    const res = await apiFetch(`${BASE_URL}/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function crearUsuarioApi(datos) {
  try {
    const res = await apiFetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(datos),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function actualizarUsuarioApi(id, datos) {
  try {
    const res = await apiFetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

