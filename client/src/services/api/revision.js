import { apiFetch } from './client.js'

const BASE_URL = '/api/revision'

/**
 * Obtener asignaciones de revisión.
 */
export async function fetchAsignaciones(revisorId) {
  try {
    const url = revisorId ? `${BASE_URL}?revisorId=${revisorId}` : BASE_URL;
    const res = await apiFetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return data.map(asig => ({ ...asig, id: asig.id_asignacion }))
  } catch {
    return []
  }
}

/**
 * Obtener todas las asignaciones (general editor).
 */
export async function fetchAsignacionesGeneral() {
  try {
    const res = await apiFetch(BASE_URL)
    if (!res.ok) return []
    const data = await res.json()
    return data.map(asig => ({ ...asig, id: asig.id_asignacion }))
  } catch {
    return []
  }
}

/**
 * Crear una asignación de revisión.
 */
export async function crearAsignacion(revisorId, manuscritoId) {
  try {
    const res = await apiFetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({
        id_revisor: revisorId,
        id_manuscrito_mongo: String(manuscritoId),
        estado: 'INVITADO',
        fecha_invitacion: new Date(),
        fecha_limite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 15 días
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Eliminar una asignación de revisión.
 */
export async function eliminarAsignacionApi(idAsignacion) {
  try {
    const res = await apiFetch(`${BASE_URL}/${idAsignacion}`, {
      method: 'DELETE',
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Enviar una revisión al backend.
 */
export async function enviarRevisionApi(articuloId, revision) {
  try {
    const res = await apiFetch(`${BASE_URL}/${articuloId}/enviar`, {
      method: 'POST',
      body: JSON.stringify(revision),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Actualizar el estado de una asignación (Aceptar/Declinar).
 */
export async function actualizarEstadoRevisionApi(idAsignacion, nuevoEstado) {
  try {
    const res = await apiFetch(`${BASE_URL}/${idAsignacion}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado }),
    })
    return res.ok
  } catch {
    return false
  }
}
