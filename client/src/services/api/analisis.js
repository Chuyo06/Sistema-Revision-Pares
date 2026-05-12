import { apiFetch } from './client.js'

const BASE_URL = '/api/analisis'

/**
 * Genera un borrador de carta editorial a partir de la decisión y las revisiones.
 *
 * @param {{ decisionEditor:string, revisiones:string[] }} payload
 * @returns {Promise<{ carta:string, timelineSugerido?:string }|null>}
 */
export async function borradorDecisionApi(payload) {
  try {
    const res = await apiFetch(`${BASE_URL}/draft-decision`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.warn('[Analisis IA] borrador-decision no disponible:', e.message)
    return null
  }
}

/**
 * Evalúa la calidad de una revisión enviada por el revisor.
 *
 * @param {Object} payload - { titulo, resumen, comentarios, puntuacion, ... }
 * @returns {Promise<Object|null>} Devuelve el análisis o null si el servicio no responde.
 */
export async function evaluarRevisionApi(payload) {
  try {
    const res = await apiFetch(`${BASE_URL}/evaluate-review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.warn('[Analisis IA] evaluate-review no disponible:', e.message)
    return null
  }
}

/**
 * Comprueba si el servicio de análisis IA está disponible y configurado.
 *
 * @returns {Promise<{ ok:boolean, message?:string, [k:string]:any }>}
 */
export async function testConexionIAApi() {
  try {
    const res = await apiFetch(`${BASE_URL}/test-connection`)
    if (!res.ok) return { ok: false, message: `HTTP ${res.status}` }
    const data = await res.json().catch(() => ({}))
    return { ok: true, ...data }
  } catch (e) {
    return { ok: false, message: e.message }
  }
}
