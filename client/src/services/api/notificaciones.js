const BASE_URL = '/api/notificaciones'

function authHeaders() {
  const raw = localStorage.getItem('rpp_usuario')
  const usuario = raw ? JSON.parse(raw) : null
  const headers = { 'Content-Type': 'application/json' }
  if (usuario?.token) {
    headers['Authorization'] = `Bearer ${usuario.token}`
  }
  return headers
}

export async function fetchNotificaciones(usuarioId) {
  try {
    const res = await fetch(`${BASE_URL}/usuario/${usuarioId}`, { headers: authHeaders() })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export async function marcarNotificacionLeida(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}/leida`, {
      method: 'PATCH',
      headers: authHeaders()
    })
    return res.ok
  } catch {
    return false
  }
}
