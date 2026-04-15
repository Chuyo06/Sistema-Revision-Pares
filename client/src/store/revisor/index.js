import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchAsignaciones, enviarRevisionApi } from '@/services/api/revision.js'
import { fetchManuscritos } from '@/services/api/manuscritos.js'
import { useAuthStore } from '../auth.js'

export const useRevisorStore = defineStore('revisor', () => {
  const articulosAsignados = ref([])
  const cargando = ref(false)

  const borradores = ref({})

  function guardarBorrador(articuloId, datos) {
    borradores.value[articuloId] = { ...datos, guardadoEn: new Date().toISOString() }
    localStorage.setItem('rpp_borradores', JSON.stringify(borradores.value))
  }

  function cargarBorrador(articuloId) {
    const guardados = JSON.parse(localStorage.getItem('rpp_borradores') || '{}')
    return guardados[articuloId] || null
  }

  async function cargarDashboard() {
    cargando.value = true
    try {
      const authStore = useAuthStore()
      const userId = authStore.usuario?.id || authStore.usuario?.id_usuario || 2 // Fallback demo
      
      const [asignaciones, manuscritos] = await Promise.all([
        fetchAsignaciones(userId),
        fetchManuscritos()
      ])

      if (asignaciones && manuscritos) {
        // Enlazar asignaciones con manuscritos
        articulosAsignados.value = asignaciones.map(asig => {
          const manuscrito = manuscritos.find(m => String(m.id) === String(asig.id_manuscrito_mongo)) || {}
          
          // Mapear estado DB MariaDB a Estado UI (o dejar el nativo)
          let estadoUI = asig.estado
          if (estadoUI === 'INVITADO') estadoUI = 'PENDIENTE'
          if (estadoUI === 'ACEPTADO') estadoUI = 'EN_PROGRESO'

          return {
            id: asig.id_asignacion, // ID numérico de MariaDB
            id_manuscrito: asig.id_manuscrito_mongo,
            titulo: manuscrito.titulo || 'Manuscrito Desconocido',
            autores: manuscrito.autores || 'Desconocido',
            convocatoria: manuscrito.convocatoria || 'General',
            deadline: asig.fecha_limite ? asig.fecha_limite.split('T')[0] : 'Sin fecha',
            estado: estadoUI,
            resumen: manuscrito.resumen || 'Sin resumen disponible'
          }
        })
      }
    } catch (e) {
      console.error("Error cargando dashboard revisor:", e)
    } finally {
      cargando.value = false
    }
  }

  async function enviarRevision(articuloId, revision) {
    const res = await enviarRevisionApi(articuloId, revision)
    if (res) {
      const articulo = articulosAsignados.value.find(a => a.id === articuloId)
      if (articulo) {
        articulo.estado = 'COMPLETADA'
        articulo.revision = revision
      }
      delete borradores.value[articuloId]
      localStorage.setItem('rpp_borradores', JSON.stringify(borradores.value))
    }
  }

  return { articulosAsignados, cargando, borradores, guardarBorrador, cargarBorrador, cargarDashboard, enviarRevision }
})
