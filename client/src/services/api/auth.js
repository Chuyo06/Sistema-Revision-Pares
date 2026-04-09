// ─────────────────────────────────────────────────────────────
// Servicio de autenticación
//
// Actualmente usa datos MOCK. Cuando el backend esté listo,
// reemplazar el cuerpo de `loginApi` por una llamada real:
//
//   const res = await fetch(`${API_BASE}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   })
//   if (!res.ok) throw new Error('Credenciales incorrectas')
//   return await res.json()
//
// El backend debe devolver un objeto con el formato:
//   { id, nombre, email, avatar, roles: [...], rolActivo }
// ─────────────────────────────────────────────────────────────

// TODO: mover a variable de entorno (.env → VITE_API_URL)
export const API_BASE = '/api'

// Usuarios mock — cada uno puede tener varios roles
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
 * Inicia sesión contra el backend.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{id, nombre, email, avatar, roles: string[], rolActivo: string}>}
 */
export function loginApi(email, password) {
  return new Promise((resolve, reject) => {
    // ── MOCK ────────────────────────────────────────────────
    setTimeout(() => {
      const encontrado = USUARIOS_MOCK.find(u => u.email === email && u.password === password)
      if (!encontrado) {
        reject(new Error('Credenciales incorrectas'))
        return
      }
      const { password: _pwd, ...usuario } = encontrado
      resolve({ ...usuario, rolActivo: usuario.roles[0] })
    }, 500)

    // ── REAL (descomentar cuando el backend esté listo) ─────
    // fetch(`${API_BASE}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // })
    //   .then(async res => {
    //     if (!res.ok) throw new Error('Credenciales incorrectas')
    //     const data = await res.json()
    //     resolve({ ...data, rolActivo: data.rolActivo ?? data.roles[0] })
    //   })
    //   .catch(reject)
  })
}
