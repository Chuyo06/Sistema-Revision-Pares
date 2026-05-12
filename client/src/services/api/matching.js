import { apiFetch } from './client.js'

const BASE_URL = '/api/matching'

/**
 * Solicita al microservicio de matching una lista de revisores sugeridos
 * para un manuscrito según su título, resumen y palabras clave.
 *
 * @param {{ titulo:string, resumen:string, palabrasClave:string }} payload
 * @returns {Promise<{ sugerencias: Array<{ revisor:string, id:string|number, afinidad:number, justificacion:string }> }>}
 */
export async function sugerirRevisoresApi(payload) {
  const res = await apiFetch(`${BASE_URL}/suggest`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Error ${res.status} al solicitar sugerencias de revisores`)
  return await res.json()
}

/**
 * Comprueba conflictos de interés entre el autor de un artículo y los revisores propuestos.
 *
 * @param {{ autor:string, revisoresId:Array<string|number> }} payload
 * @returns {Promise<{ alertas: Array<{ revisorId, riesgo, justificacion }>, hayConflicto: boolean }>}
 */
export async function verificarConflictosApi(payload) {
  const res = await apiFetch(`${BASE_URL}/check-conflicts`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Error ${res.status} al verificar conflictos de interés`)
  return await res.json()
}
