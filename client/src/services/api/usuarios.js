import { apiFetch } from './client.js'

const BASE_URL = '/api/usuarios'
const CONFIG_URL = `${BASE_URL}/config`

/**
 * Configuración global (áreas temáticas + parámetros del análisis IA).
 * Centralizada aquí para que ningún componente / store hable directo con apiFetch.
 */
export async function fetchAreasTematicasApi() {
  try {
    const res = await apiFetch(`${CONFIG_URL}/areas`)
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('[Usuarios] No se pudieron cargar áreas temáticas:', err.message)
    return null
  }
}

export async function guardarAreasTematicasApi(valor) {
  try {
    const res = await apiFetch(`${CONFIG_URL}/areas`, {
      method: 'POST',
      body: JSON.stringify({ valor }),
    })
    return res.ok
  } catch (err) {
    console.warn('[Usuarios] Error guardando áreas temáticas:', err.message)
    return false
  }
}

export async function fetchConfiguracionIAApi() {
  try {
    const res = await apiFetch(`${CONFIG_URL}/ia`)
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('[Usuarios] No se pudo cargar configuración IA:', err.message)
    return null
  }
}

export async function guardarConfiguracionIAApi(valor) {
  try {
    const res = await apiFetch(`${CONFIG_URL}/ia`, {
      method: 'POST',
      body: JSON.stringify({ valor }),
    })
    return res.ok
  } catch (err) {
    console.warn('[Usuarios] Error guardando configuración IA:', err.message)
    return false
  }
}

export async function fetchUsuarios() {
  try {
    const res = await apiFetch(BASE_URL)
    if (!res.ok) {
      console.warn('[Usuarios] Error HTTP:', res.status)
      return []
    }
    return await res.json()
  } catch (err) {
    console.warn('[Usuarios] Sin respuesta del backend:', err.message)
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
  } catch (err) {
    console.warn('[Usuarios] Error en toggleEstadoUsuarioApi:', err.message)
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
  } catch (err) {
    console.warn('[Usuarios] Error en crearUsuarioApi:', err.message)
    return null
  }
}

export async function actualizarUsuarioApi(id, datos) {
  try {
    const res = await apiFetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al actualizar usuario')
    }
    return await res.json()
  } catch (err) {
    // El caller (store admin) muestra snackbar al usuario; aquí solo log discreto.
    console.warn('[Usuarios] actualizarUsuarioApi falló:', err.message)
    throw err
  }
}
