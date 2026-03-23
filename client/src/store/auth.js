import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const USUARIOS_MOCK = [
  { id: 1, nombre: 'Ana García', email: 'autor@demo.com', password: '1234', rol: 'autor', avatar: 'AG' },
  { id: 2, nombre: 'Carlos López', email: 'revisor@demo.com', password: '1234', rol: 'revisor', avatar: 'CL' },
  { id: 3, nombre: 'Dr. Martínez', email: 'editor@demo.com', password: '1234', rol: 'editor', avatar: 'DM' },
  { id: 4, nombre: 'Admin Sistema', email: 'admin@demo.com', password: '1234', rol: 'administrador', avatar: 'AS' },
]

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(JSON.parse(localStorage.getItem('rpp_usuario') || 'null'))
  const cargando = ref(false)
  const error = ref(null)

  const estaAutenticado = computed(() => !!usuario.value)
  const rol = computed(() => usuario.value?.rol ?? null)

  function login(email, password) {
    cargando.value = true
    error.value = null
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const encontrado = USUARIOS_MOCK.find(u => u.email === email && u.password === password)
        if (encontrado) {
          usuario.value = encontrado
          localStorage.setItem('rpp_usuario', JSON.stringify(encontrado))
          cargando.value = false
          resolve(encontrado)
        } else {
          error.value = 'Credenciales incorrectas'
          cargando.value = false
          reject(new Error('Credenciales incorrectas'))
        }
      }, 600)
    })
  }

  function logout() {
    usuario.value = null
    localStorage.removeItem('rpp_usuario')
  }

  return { usuario, cargando, error, estaAutenticado, rol, login, logout }
})
