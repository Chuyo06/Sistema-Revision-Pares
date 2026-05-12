import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchAsignaciones, enviarRevisionApi, actualizarEstadoRevisionApi } from '@/services/api/revision.js'
import { fetchManuscritos } from '@/services/api/manuscritos.js'
import { crearNotificacionApi } from '@/services/api/notificaciones.js'
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
      const userId = authStore.usuario?.id || authStore.usuario?.id_usuario
      
      const [asignaciones, manuscritos] = await Promise.all([
        fetchAsignaciones(userId),
        fetchManuscritos()
      ])

      if (asignaciones && manuscritos) {
        // Normalizar _id de MongoDB → id (igual que hace el editor store)
        const manuscritosNorm = manuscritos.map(m => ({
          ...m,
          id: m._id || m.id,
        }))

        // Enlazar asignaciones con manuscritos
        articulosAsignados.value = asignaciones.map(asig => {
          const manuscrito = manuscritosNorm.find(m => String(m.id) === String(asig.id_manuscrito_mongo)) || {}
          
          // Mapear estado DB MariaDB a Estado UI
          let estadoUI = asig.estado
          if (estadoUI === 'INVITADO') estadoUI = 'PENDIENTE'
          if (estadoUI === 'ACEPTADO') estadoUI = 'EN_PROGRESO'

          const fechaInvitacion = asig.fecha_invitacion ? new Date(asig.fecha_invitacion) : new Date()
          const limiteRespuesta = new Date(fechaInvitacion.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 días para responder
          const diasRestantesRespuesta = Math.max(0, Math.ceil((limiteRespuesta - new Date()) / (1000 * 60 * 60 * 24)))

          return {
            id: asig.id_asignacion, // ID numérico de MariaDB
            id_manuscrito: asig.id_manuscrito_mongo,
            titulo: manuscrito.titulo || 'Manuscrito Desconocido',
            autores: manuscrito.autores || 'Desconocido',
            convocatoria: manuscrito.convocatoria || 'General',
            fecha_invitacion: asig.fecha_invitacion,
            diasRestantesRespuesta,
            deadline: asig.fecha_limite ? asig.fecha_limite.split('T')[0] : 'Sin fecha',
            estado: estadoUI,
            resumen: manuscrito.resumen || 'Sin resumen disponible',
            // Campos necesarios para que el visor PDF y la vista de detalle
            // (RevisionPage) funcionen: la referencia es la "RPP-YYYY-NNNN" que
            // el backend usa para servir el archivo en GET /manuscritos/download/:ref.
            referencia: manuscrito.referencia || null,
            contenido: manuscrito.contenido || '',
            fechaEnvio: manuscrito.fechaEnvio || manuscrito.fechaSubida || null,
          }
        })
      }
    } catch (e) {
      console.warn('[Revisor] No se pudo cargar el dashboard:', e.message)
    } finally {
      cargando.value = false
    }
  }

  async function enviarRevision(articuloId, revision) {
    const res = await enviarRevisionApi(articuloId, revision)
    if (res) {
      const articulo = articulosAsignados.value.find(a => String(a.id) === String(articuloId))
      if (articulo) {
        articulo.estado = 'COMPLETADA'
        articulo.revision = revision
      }
      delete borradores.value[articuloId]
      localStorage.setItem('rpp_borradores', JSON.stringify(borradores.value))
    }
  }

  async function responderInvitacion(idAsignacion, aceptar) {
    const nuevoEstado = aceptar ? 'ACEPTADO' : 'DECLINADO'
    const res = await actualizarEstadoRevisionApi(idAsignacion, nuevoEstado)
    if (res) {
      const asig = articulosAsignados.value.find(a => a.id === idAsignacion)
      if (asig) {
        asig.estado = aceptar ? 'EN_PROGRESO' : 'DECLINADO'
      }

      // Si declinó, notificar al editor (fire-and-forget). Si el backend
      // de notificaciones no responde, se silencia: el flujo no se rompe.
      if (!aceptar && asig) {
        try {
          const authStore = useAuthStore()
          await crearNotificacionApi({
            tipo: 'INVITACION_RECHAZADA',
            rol_destinatario: 'editor',
            mensaje: `${authStore.usuario?.nombre || 'Un revisor'} declinó la invitación a revisar "${asig.titulo}". Considera asignar otro revisor.`,
            referencia_manuscrito: asig.id_manuscrito,
            referencia_asignacion: idAsignacion,
          })
        } catch (e) {
          console.warn('[Revisor] No se pudo notificar al editor sobre rechazo:', e)
        }
      }
    }
    return res
  }

  return { articulosAsignados, cargando, borradores, guardarBorrador, cargarBorrador, cargarDashboard, enviarRevision, responderInvitacion }
})
