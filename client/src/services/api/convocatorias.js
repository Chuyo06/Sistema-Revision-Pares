import { apiFetch } from './client.js'

const BASE_URL = '/api/convocatorias'

/**
 * Lista de convocatorias. Devuelve [] si el backend no responde
 * (la UI sigue funcionando con estado vacío natural).
 */
export async function fetchConvocatorias() {
  try {
    const res = await apiFetch(BASE_URL)
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

/**
 * Crea una convocatoria. Lanza un Error solo cuando podemos construir un
 * mensaje útil; en otro caso devuelve null y deja que la UI decida feedback.
 * El error incluye el mensaje del backend (BadRequestException, etc.).
 */
export async function crearConvocatoria(datos) {
  try {
    const res = await apiFetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(datos),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const msg = data.message || `No se pudo crear la convocatoria (HTTP ${res.status}).`
      throw new Error(msg)
    }
    return await res.json()
  } catch (e) {
    // Reescribimos como un Error limpio sin stack trace anidado, para que
    // la UI muestre un snackbar legible en vez de "Error: Error: Error..."
    if (e instanceof Error && e.message) throw new Error(e.message)
    throw new Error('No se pudo conectar con el servicio de convocatorias.')
  }
}

export async function actualizarConvocatoria(id, datos) {
  try {
    const res = await apiFetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || `No se pudo actualizar la convocatoria (HTTP ${res.status}).`)
    }
    return await res.json()
  } catch (e) {
    if (e instanceof Error && e.message) throw new Error(e.message)
    throw new Error('No se pudo conectar con el servicio de convocatorias.')
  }
}

export async function eliminarConvocatoria(id) {
  try {
    const res = await apiFetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || `No se pudo eliminar la convocatoria (HTTP ${res.status}).`)
    }
    return true
  } catch (e) {
    if (e instanceof Error && e.message) throw new Error(e.message)
    throw new Error('No se pudo conectar con el servicio de convocatorias.')
  }
}
