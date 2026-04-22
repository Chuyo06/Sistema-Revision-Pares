import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchManuscritos, actualizarEstadoManuscrito } from '@/services/api/manuscritos.js'
import { fetchUsuarios } from '@/services/api/usuarios.js'
import { fetchAsignacionesGeneral, crearAsignacion } from '@/services/api/revision.js'

export const useEditorStore = defineStore('editor', () => {
  const manuscritos = ref([])
  const revisoresDisponibles = ref([])
  const asignaciones = ref([])
  const cargando = ref(false)

  const metricas = computed(() => ({
    totalManuscritos: manuscritos.value.length,
    enRevision: manuscritos.value.filter(m => m.estado === 'EN_REVISION').length,
    aceptados: manuscritos.value.filter(m => m.estado === 'ACEPTADO').length,
    rechazados: manuscritos.value.filter(m => m.estado === 'RECHAZADO').length,
    enviados: manuscritos.value.filter(m => m.estado === 'ENVIADO').length,
    tasaAceptacion: Math.round(
      (manuscritos.value.filter(m => m.estado === 'ACEPTADO').length /
        (manuscritos.value.filter(m => ['ACEPTADO','RECHAZADO'].includes(m.estado)).length || 1)) * 100
    ) || 0,
    tiempoMedioRevision: 18,
    revisoresActivos: revisoresDisponibles.value.filter(r => r.estado === 'activo').length,
    alertasPendientes: manuscritos.value.filter(m => m.estado === 'ENVIADO').length,
  }))

  async function cargarDashboardEditor() {
    cargando.value = true
    try {
      const [listManuscritos, listUsuarios, listAsig] = await Promise.all([
        fetchManuscritos(),
        fetchUsuarios(),
        fetchAsignacionesGeneral()
      ])

      if (listManuscritos) {
        manuscritos.value = listManuscritos.map(m => {
          const asigsDelArticulo = (listAsig || []).filter(a => String(a.id_manuscrito_mongo) === String(m.id))
          return {
            ...m,
            revisoresAsignados: asigsDelArticulo.length,
            revisionesCompletadas: asigsDelArticulo.filter(a => a.estado === 'COMPLETADA').length,
            alertas: asigsDelArticulo.length === 0 && m.estado === 'ENVIADO' ? ['Requiere asignación de revisores'] : []
          }
        })
      }

      if (listUsuarios && Array.isArray(listUsuarios)) {
        revisoresDisponibles.value = listUsuarios
          .filter(u => u.roles?.includes('revisor'))
          .map(u => ({
            ...u,
            disponible: true, // Por ahora todos están disponibles
            matching: Math.floor(Math.random() * 40) + 60, // Mock de matching (60-99%)
            especialidades: u.institucion ? ['Académico', 'Investigador'] : ['General']
          }))
      }

      if (listAsig) {
        asignaciones.value = listAsig
      }
    } catch (e) {
      console.error("Error cargando dashboard editor:", e)
    } finally {
      cargando.value = false
    }
  }

  async function asignarRevisor(manuscritoId, revisorId) {
    const exito = await crearAsignacion(revisorId, manuscritoId)
    if (exito) {
      // Si era el primer revisor, pasamos el manuscrito a EN_REVISION
      const manuscrito = manuscritos.value.find(m => String(m.id) === String(manuscritoId))
      if (manuscrito && manuscrito.estado === 'ENVIADO') {
        await actualizarEstadoManuscrito(manuscritoId, 'EN_REVISION')
      }
      await cargarDashboardEditor()
      return true
    }
    return false
  }

  async function tomarDecision(manuscritoId, decision) {
    const exito = await actualizarEstadoManuscrito(manuscritoId, decision)
    if (exito) {
      await cargarDashboardEditor()
    }
    return exito
  }

  return { 
    manuscritos, 
    revisoresDisponibles, 
    asignaciones, 
    metricas, 
    cargando, 
    cargarDashboardEditor, 
    asignarRevisor, 
    tomarDecision 
  }
})
