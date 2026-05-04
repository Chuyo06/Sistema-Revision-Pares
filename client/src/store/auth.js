import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, registerApi } from '@/services/api/auth.js'
import { actualizarUsuarioApi } from '@/services/api/usuarios.js'

function cargarUsuarioPersistido() {
  const raw = JSON.parse(localStorage.getItem('rpp_usuario') || 'null')
  if (!raw) return null
  // Migra el formato viejo ({ rol: 'autor' }) al nuevo ({ roles: [...], rolActivo })
  if (!raw.roles || !raw.rolActivo) {
    if (raw.rol) {
      return { ...raw, roles: [raw.rol], rolActivo: raw.rol }
    }
    localStorage.removeItem('rpp_usuario')
    return null
  }
  return raw
}

export const useAuthStore = defineStore('auth', () => {
  const usuario  = ref(cargarUsuarioPersistido())
  const cargando = ref(false)
  const error    = ref(null)
  const mensajeExito = ref(null)

  const estaAutenticado = computed(() => !!usuario.value)
  const roles           = computed(() => usuario.value?.roles ?? [])
  const rolActivo       = computed(() => usuario.value?.rolActivo ?? null)
  // Alias para compatibilidad con código existente
  const rol             = computed(() => rolActivo.value)
  const tieneMultiplesRoles = computed(() => roles.value.length > 1)

  async function login(email, password) {
    cargando.value = true
    error.value = null
    try {
      const data = await loginApi(email, password)
      persistir(data)
      return data
    } catch (e) {
      error.value = e.message || 'Error al iniciar sesión'
      throw e
    } finally {
      cargando.value = false
    }
  }

  async function register(datos) {
    cargando.value = true
    error.value = null
    try {
      return await registerApi(datos)
    } catch (e) {
      error.value = e.message || 'Error al registrarse'
      throw e
    } finally {
      cargando.value = false
    }
  }

  function cambiarRol(nuevoRol) {
    if (!usuario.value) return
    if (!usuario.value.roles.includes(nuevoRol)) return
    persistir({ ...usuario.value, rolActivo: nuevoRol })
  }

  function logout() {
    usuario.value = null
    localStorage.removeItem('rpp_usuario')
  }

  function actualizarPerfil(nuevosDatos) {
    if (!usuario.value) return
    persistir({ ...usuario.value, ...nuevosDatos })
  }

  async function guardarPerfilBackend(datos) {
    if (!usuario.value?.id) return null
    cargando.value = true
    error.value = null
    try {
      const resp = await actualizarUsuarioApi(usuario.value.id, datos)
      if (resp) {
        // Actualizamos localmente con los datos del backend
        const rolesBackend = resp.roles || []
        const rolActual = rolesBackend.includes(usuario.value.rolActivo) ? usuario.value.rolActivo : (rolesBackend[0] || usuario.value.rolActivo)
        persistir({ 
          ...usuario.value, 
          ...resp,
          roles: rolesBackend,
          rolActivo: rolActual
        })
      }
      return resp
    } catch (e) {
      error.value = 'Error al guardar perfil en el servidor'
      throw e
    } finally {
      cargando.value = false
    }
  }

  function persistir(data) {
    usuario.value = data
    localStorage.setItem('rpp_usuario', JSON.stringify(data))
  }

  return {
    usuario, cargando, error, mensajeExito,
    estaAutenticado, roles, rolActivo, rol, tieneMultiplesRoles,
    login, register, logout, cambiarRol, actualizarPerfil, guardarPerfilBackend
  }
})
