import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  fetchUsuarios,
  toggleEstadoUsuarioApi,
  crearUsuarioApi,
  actualizarUsuarioApi,
  fetchAreasTematicasApi,
  guardarAreasTematicasApi,
  fetchConfiguracionIAApi,
  guardarConfiguracionIAApi,
} from '@/services/api/usuarios.js'
import { fetchManuscritos } from '@/services/api/manuscritos.js'

export const useAdminStore = defineStore('administrador', () => {
  const usuarios = ref([])
  const manuscritos = ref([])

  const configuracionIA = ref({
    modeloMatching: 'gemini-1.5-flash',
    modeloAnalisis: 'gemini-1.5-flash',
    umbralConflictoInteres: 0.85,
    umbralPlagio: 0.75,
    asistenciaCalidadActiva: true,
    analisisEticaActivo: true,
    generacionCartasActiva: true,
  })

  const areasTematicas = ref([])

  async function cargarConfiguraciones() {
    const areas = await fetchAreasTematicasApi()
    if (Array.isArray(areas) && areas.length > 0) {
      areasTematicas.value = areas
    } else {
      // Fallback default si no hay en DB o el servicio no respondió.
      areasTematicas.value = ['Inteligencia Artificial', 'Machine Learning', 'Ciberseguridad', 'Ingeniería de Software']
    }

    const ia = await fetchConfiguracionIAApi()
    if (ia) configuracionIA.value = ia
  }

  async function guardarAreas() {
    const ok = await guardarAreasTematicasApi(areasTematicas.value)
    if (!ok) registrarError('config-areas', 'Error al guardar áreas temáticas')
  }

  async function guardarConfiguracionIA() {
    const ok = await guardarConfiguracionIAApi(configuracionIA.value)
    if (!ok) registrarError('config-ia', 'Error al guardar configuración IA')
  }

  function agregarArea(area) {
    if (area && !areasTematicas.value.includes(area)) {
      areasTematicas.value.push(area)
      guardarAreas()
      return true
    }
    return false
  }

  function eliminarArea(area) {
    areasTematicas.value = areasTematicas.value.filter(a => a !== area)
    guardarAreas()
  }

  // Registros de Errores y Alertas
  const erroresSistema = ref([
    { id: 1, fecha: new Date(Date.now() - 3600000).toISOString(), servicio: 'analisis-ia', mensaje: 'Timeout al conectar con Gemini API', tipo: 'error' },
    { id: 2, fecha: new Date(Date.now() - 86400000).toISOString(), servicio: 'matching', mensaje: 'Fallo temporal en cálculo de distancias', tipo: 'warning' },
  ])

  function registrarError(servicio, mensaje, tipo = 'error') {
    erroresSistema.value.unshift({
      id: Date.now(),
      fecha: new Date().toISOString(),
      servicio,
      mensaje,
      tipo
    })
    
    // Mantener solo los últimos 50 logs
    if (erroresSistema.value.length > 50) {
      erroresSistema.value.pop()
    }
  }

  const metricas = computed(() => ({
    totalUsuarios: usuarios.value.length,
    autores: usuarios.value.filter(u => u.roles?.includes('autor')).length,
    revisores: usuarios.value.filter(u => u.roles?.includes('revisor')).length,
    editores: usuarios.value.filter(u => u.roles?.includes('editor')).length,
    activos: usuarios.value.filter(u => u.estado === 'activo').length,
    inactivos: usuarios.value.filter(u => u.estado === 'inactivo').length,
    totalManuscritos: manuscritos.value.length,
  }))

  const cargando = ref(false)

  async function cargarDatosGlobales() {
    cargando.value = true
    try {
      await cargarConfiguraciones()
      const [uData, mData] = await Promise.all([
        fetchUsuarios(),
        fetchManuscritos()
      ])
      if (uData) usuarios.value = uData
      if (mData) manuscritos.value = mData
    } catch (err) {
      console.warn('[Admin] No se pudieron cargar datos globales:', err.message)
    } finally {
      cargando.value = false
    }
  }

  async function toggleEstadoUsuario(id) {
    const usuario = usuarios.value.find(u => Number(u.id) === Number(id))
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

  async function editarUsuario(id, datos) {
    const actualizado = await actualizarUsuarioApi(id, datos)
    if (actualizado) {
      await cargarDatosGlobales()
    }
  }

  return { 
    usuarios, manuscritos, configuracionIA, metricas, areasTematicas, erroresSistema, cargando,
    cargarUsuarios: cargarDatosGlobales, toggleEstadoUsuario, agregarUsuario, editarUsuario,
    agregarArea, eliminarArea, registrarError, guardarConfiguracionIA
  }
})
