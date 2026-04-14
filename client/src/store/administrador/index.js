import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchUsuarios, toggleEstadoUsuarioApi, crearUsuarioApi } from '@/services/api/usuarios.js'
import { fetchManuscritos } from '@/services/api/manuscritos.js'

export const useAdminStore = defineStore('administrador', () => {
  const usuarios = ref([])
  const manuscritos = ref([])

  const configuracionIA = ref({
    modeloMatching: 'claude-sonnet-4-6',
    modeloAnalisis: 'claude-sonnet-4-6',
    umbralConflictoInteres: 0.85,
    umbralPlagio: 0.75,
    asistenciaCalidadActiva: true,
    analisisEticaActivo: true,
    generacionCartasActiva: true,
  })

  const metricas = computed(() => ({
    totalUsuarios: usuarios.value.length,
    autores: usuarios.value.filter(u => u.rol === 'autor').length,
    revisores: usuarios.value.filter(u => u.rol === 'revisor').length,
    editores: usuarios.value.filter(u => u.rol === 'editor').length,
    activos: usuarios.value.filter(u => u.estado === 'activo').length,
    inactivos: usuarios.value.filter(u => u.estado === 'inactivo').length,
    totalManuscritos: manuscritos.value.length,
  }))

  async function cargarDatosGlobales() {
    const [uData, mData] = await Promise.all([
      fetchUsuarios(),
      fetchManuscritos()
    ])
    if (uData) usuarios.value = uData
    if (mData) manuscritos.value = mData
  }

  async function toggleEstadoUsuario(id) {
    const usuario = usuarios.value.find(u => u.id === id)
    if (usuario) {
      const exitoso = await toggleEstadoUsuarioApi(id, usuario.estado)
      if (exitoso) {
        usuario.estado = usuario.estado === 'activo' ? 'inactivo' : 'activo'
      }
    }
  }

  async function agregarUsuario(datos) {
    const nuevo = await crearUsuarioApi(datos)
    if (nuevo) {
      await cargarDatosGlobales()
    }
  }

  return { usuarios, manuscritos, configuracionIA, metricas, cargarUsuarios: cargarDatosGlobales, toggleEstadoUsuario, agregarUsuario }
})
