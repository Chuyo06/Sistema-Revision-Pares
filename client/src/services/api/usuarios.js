const BASE_URL = '/api/usuarios'

function authHeaders() {
  const raw = localStorage.getItem('rpp_usuario')
  const usuario = raw ? JSON.parse(raw) : null
  const headers = { 'Content-Type': 'application/json' }
  if (usuario?.token) {
    headers['Authorization'] = `Bearer ${usuario.token}`
  }
  return headers
}

export async function fetchUsuarios() {
  try {
    const res = await fetch(`${BASE_URL}`, { headers: authHeaders() })
    if (!res.ok) return []
    return await res.json()
  } catch {
    console.warn('Backend unavailable, returning empty users array')
    return []
  }
}

export async function toggleEstadoUsuarioApi(id, estadoActual) {
  const nuevoEstado = estadoActual === 'activo' ? 'INACTIVO' : 'ACTIVO'
  try {
    const res = await fetch(`${BASE_URL}/${id}/estado`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ estado: nuevoEstado }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function crearUsuarioApi(datos) {
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        email: datos.email,
        password: datos.password || '1234',
        nombre: datos.nombre,
        rol: datos.rol,
      }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function actualizarUsuarioApi(id, datos) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({
        email: datos.email,
        nombre: datos.nombre,
        rol: datos.rol,
      }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
