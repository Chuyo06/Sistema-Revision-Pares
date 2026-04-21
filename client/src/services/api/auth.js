// ─────────────────────────────────────────────────────────────
// Servicio de autenticación
//
// Intenta conectar al backend real (NestJS usuarios :3001).
// Si el backend no está disponible, usa datos MOCK como fallback.
// ─────────────────────────────────────────────────────────────

// Ruta proxy definida en vite.config.js → http://localhost:3001
const AUTH_URL = '/api/auth'

// Mapeo de roles del backend a nombres de ruta del frontend
const ROL_MAP = { admin: 'administrador' }

// ── Usuarios mock (fallback cuando el backend no responde) ──
const USUARIOS_MOCK = [
  {
    id: 1,
    nombre: 'Ana García',
    email: 'autor@demo.com',
    password: '1234',
    avatar: 'AG',
    roles: ['autor'],
  },
  {
    id: 2,
    nombre: 'Carlos López',
    email: 'revisor@demo.com',
    password: '1234',
    avatar: 'CL',
    roles: ['revisor', 'autor'],
  },
  {
    id: 3,
    nombre: 'Dr. Martínez',
    email: 'editor@demo.com',
    password: '1234',
    avatar: 'DM',
    roles: ['editor', 'revisor'],
  },
  {
    id: 4,
    nombre: 'Admin Sistema',
    email: 'admin@demo.com',
    password: '1234',
    avatar: 'AS',
    roles: ['administrador'],
  },
]

/**
 * Inicia sesión. Prueba el backend real, si falla usa mock.
 * @returns {Promise<{id, nombre, email, avatar, roles: string[], rolActivo: string, token?: string}>}
 */
export async function loginApi(email, password) {
  // ── Intentar backend real ──
  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      const data = await res.json()
      // Normalizar respuesta del backend al formato que espera el store
      const mapRol = (r) => ROL_MAP[r] || r
      
      const rolesProcesados = data.roles 
        ? data.roles.map(r => mapRol(r.toLowerCase()))
        : [mapRol((data.rol || 'autor').toLowerCase())]

      return {
        id: data.id ?? data.id_usuario,
        nombre: data.nombre ?? data.email,
        email: data.email,
        avatar: (data.nombre || data.email || '').substring(0, 2).toUpperCase(),
        roles: rolesProcesados,
        rolActivo: data.rolActivo 
          ? mapRol(data.rolActivo.toLowerCase()) 
          : rolesProcesados[0],
        token: data.access_token ?? data.token ?? null,
      }
    }

    // Si el servidor respondió pero con error (401, 403, etc.)
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Credenciales incorrectas')
  } catch (err) {
    // Si el error viene del backend (credenciales inválidas, etc.), re-lanzar
    if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed') && !err.message.includes('NetworkError')) {
      throw err
    }

    // ── Fallback a MOCK (backend no disponible) ──
    console.warn('[Auth] Backend no disponible, usando datos mock:', err.message)
    return loginMock(email, password)
  }
}

/**
 * Registro de usuario contra el backend real.
 */
export async function registerApi(datos) {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Error al registrar')
  }
  return await res.json()
}

/**
 * Actualiza el avatar del usuario en el backend.
 */
export async function updateAvatarApi(userId, avatarBase64) {
  const res = await fetch(`${AUTH_URL}/avatar/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: avatarBase64 }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Error al actualizar el avatar')
  }
  return await res.json()
}

// ── Mock fallback ──────────────────────────────────────────
function loginMock(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const encontrado = USUARIOS_MOCK.find(u => u.email === email && u.password === password)
      if (!encontrado) {
        reject(new Error('Credenciales incorrectas'))
        return
      }
      const { password: _pwd, ...usuario } = encontrado
      resolve({ ...usuario, rolActivo: usuario.roles[0] })
    }, 400)
  })
}
