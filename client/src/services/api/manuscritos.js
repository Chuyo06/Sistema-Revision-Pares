import { apiFetch } from './client.js'

const BASE_URL = '/api/manuscritos'

/**
 * Obtener todos los manuscritos del backend.
 */
export async function fetchManuscritos() {
  try {
    const res = await apiFetch(BASE_URL)
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('[Manuscritos] Error en fetch:', err.message)
    return null
  }
}

/**
 * Obtener manuscritos por autor (excluye borradores por default).
 */
export async function fetchManuscritosPorAutor(autorId, { incluirBorradores = false } = {}) {
  try {
    const qs = incluirBorradores ? '?incluirBorradores=true' : ''
    const res = await apiFetch(`${BASE_URL}/autor/${autorId}${qs}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Obtener solo los borradores del autor.
 */
export async function fetchBorradoresPorAutor(autorId) {
  try {
    const res = await apiFetch(`${BASE_URL}/autor/${autorId}/borradores`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Actualizar estado de un manuscrito.
 */
export async function actualizarEstadoManuscrito(id, estado, motivoRechazo = undefined) {
  try {
    const payload = { estado }
    if (motivoRechazo !== undefined) {
      payload.motivoRechazo = motivoRechazo
    }
    const res = await apiFetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Asignar editor de sección a un manuscrito.
 */
export async function asignarEditorSeccionApi(manuscritoId, editorSeccionId) {
  try {
    const res = await apiFetch(`${BASE_URL}/${manuscritoId}`, {
      method: 'PATCH',
      body: JSON.stringify({ editorSeccionId }),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Crear un manuscrito en el backend.
 * Lanza error si el HTTP falla, devuelve el documento creado si tuvo éxito.
 */
export async function crearManuscrito(datos) {
  const res = await apiFetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(datos),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error ${res.status} al crear manuscrito`)
  }
  return await res.json()
}

/**
 * Actualizar datos completos de un manuscrito.
 */
export async function actualizarDatosManuscrito(id, datos) {
  try {
    const res = await apiFetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Eliminar un manuscrito.
 */
export async function eliminarManuscrito(id) {
  try {
    const res = await apiFetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Descargar un archivo PDF por su referencia.
 */
export async function descargarArchivo(referencia) {
  try {
    const res = await apiFetch(`${BASE_URL}/download/${referencia}`)
    if (!res.ok) throw new Error('No se pudo descargar el archivo')
    
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = referencia.endsWith('.pdf') ? referencia : `${referencia}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    return true
  } catch (err) {
    console.error('[Manuscritos] Error en descarga:', err)
    return false
  }
}

