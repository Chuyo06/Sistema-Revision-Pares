// ─────────────────────────────────────────────────────────────
// Servicio de revisión
//
// Proxy definido en vite.config.js → http://localhost:3003
// Fallback: retorna null para que los stores usen mock.
// ─────────────────────────────────────────────────────────────

const BASE_URL = '/api/revision'

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
 * Obtener asignaciones de revisión.
 * @returns {Promise<Array|null>}
 */
export async function fetchAsignaciones(revisorId) {
  try {
    const url = revisorId ? `${BASE_URL}?revisorId=${revisorId}` : BASE_URL;
    const res = await fetch(url, { headers: authHeaders() })
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
    const res = await fetch(BASE_URL, { headers: authHeaders() })
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
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: authHeaders(),
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
 * Solo se permitirá quitar al revisor si todavía no envió su revisión
 * (la validación de "no completada" se hace antes desde el store).
 */
export async function eliminarAsignacionApi(idAsignacion) {
  try {
    const res = await fetch(`${BASE_URL}/${idAsignacion}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Enviar una revisión al backend.
 * @returns {Promise<Object|null>}
 */
export async function enviarRevisionApi(articuloId, revision) {
  try {
    const res = await fetch(`${BASE_URL}/${articuloId}/enviar`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(revision),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    console.warn('[Revisión] Backend no disponible, guardando solo en mock')
    return null
  }
}

/**
 * Actualizar el estado de una asignación.
 */
export async function actualizarEstadoRevisionApi(idAsignacion, nuevoEstado) {
  try {
    const res = await fetch(`${BASE_URL}/${idAsignacion}/estado`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ estado: nuevoEstado }),
    })
    return res.ok
  } catch {
    return false
  }
}
