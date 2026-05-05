import { apiFetch } from './client.js'

const BASE_URL = '/api/convocatorias'

export async function fetchConvocatorias() {
  const res = await apiFetch(BASE_URL)
  if (!res.ok) return []
  return await res.json()
}

export async function crearConvocatoria(datos) {
  const res = await apiFetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(datos)
  })
  if (!res.ok) throw new Error('Error al crear la convocatoria')
  return await res.json()
}

export async function actualizarConvocatoria(id, datos) {
  const res = await apiFetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos)
  })
  if (!res.ok) throw new Error('Error al actualizar la convocatoria')
  return await res.json()
}

export async function eliminarConvocatoria(id) {
  const res = await apiFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Error al eliminar la convocatoria')
  return true
}
