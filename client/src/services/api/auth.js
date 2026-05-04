import { apiFetch } from './client.js'

const AUTH_URL = '/api/auth'

const ROL_MAP = { admin: 'administrador' }

const USUARIOS_MOCK = [
  { id: 1, nombre: 'Ana García', email: 'autor@demo.com', password: '1234', avatar: 'AG', roles: ['autor'] },
  { id: 2, nombre: 'Carlos López', email: 'revisor@demo.com', password: '1234', avatar: 'CL', roles: ['revisor', 'autor'] },
  { id: 3, nombre: 'Dr. Martínez', email: 'editor@demo.com', password: '1234', avatar: 'DM', roles: ['editor', 'editor_jefe', 'revisor'] },
  { id: 4, nombre: 'Admin Sistema', email: 'admin@demo.com', password: '1234', avatar: 'AS', roles: ['administrador'] },
  { id: 14, nombre: 'Dra. Editora Sección', email: 'editor.seccion@demo.com', password: '1234', avatar: 'ES', roles: ['editor', 'editor_seccion'] },
]

export async function loginApi(email, password) {
  try {
    const res = await apiFetch(`${AUTH_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      const data = await res.json()
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

    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Credenciales incorrectas')
  } catch (err) {
    // Para desarrollo: usar datos mock si el backend no está disponible
    // Esto permite probar la app sin necesidad de que todos los microservicios estén corriendo
    console.warn('[Auth] Backend no disponible, usando datos mock:', err.message)
    return loginMock(email, password)
  }
}

export async function registerApi(datos) {
  const res = await apiFetch(`${AUTH_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(datos),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Error al registrar')
  }
  return await res.json()
}

export async function updateAvatarApi(userId, avatarBase64) {
  const res = await apiFetch(`${AUTH_URL}/avatar/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ avatar: avatarBase64 }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Error al actualizar el avatar')
  }
  return await res.json()
}

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

export async function cambiarPasswordApi(userId, passwordActual, passwordNueva) {
  const res = await apiFetch(`${AUTH_URL}/password/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ passwordActual, passwordNueva }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Error al cambiar la contraseña')
  }
  return await res.json()
}

