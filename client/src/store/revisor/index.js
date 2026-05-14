import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchAsignaciones, enviarRevisionApi, actualizarEstadoRevisionApi } from '@/services/api/revision.js'
import { fetchManuscritos } from '@/services/api/manuscritos.js'
import { crearNotificacionApi } from '@/services/api/notificaciones.js'
import { useAuthStore } from '../auth.js'
import { set as idbSet, get as idbGet, del as idbDel } from '@/utils/idb.js'

export const useRevisorStore = defineStore('revisor', () => {
  const articulosAsignados = ref([])
  const cargando = ref(false)

  const borradores = ref({})

  async function guardarBorrador(articuloId, datos) {
    const draft = { ...datos, guardadoEn: new Date().toISOString() }
    borradores.value[articuloId] = draft
    await idbSet(`borrador_${articuloId}`, draft)
  }

  async function cargarBorrador(articuloId) {
    // Intento de fallback a localStorage (migración transparente)
    const oldGuardados = JSON.parse(localStorage.getItem('rpp_borradores') || '{}')
    let guardado = await idbGet(`borrador_${articuloId}`)
    
    if (!guardado && oldGuardados[articuloId]) {
      guardado = oldGuardados[articuloId]
      await idbSet(`borrador_${articuloId}`, guardado) // Migrar a IDB
      
      // Eliminar el fantasma de localStorage
      delete oldGuardados[articuloId]
      localStorage.setItem('rpp_borradores', JSON.stringify(oldGuardados))
    }
    
    if (guardado) {
      borradores.value[articuloId] = guardado
    }
    return guardado || null
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
            autores: 'Anónimo (Doble ciego)',
            convocatoria: manuscrito.convocatoria || 'General',
            fecha_invitacion: asig.fecha_invitacion,
            diasRestantesRespuesta,
            deadline: asig.fecha_limite ? asig.fecha_limite.split('T')[0] : 'Sin fecha',
            estado: estadoUI,
            ronda: asig.ronda || 1,
            resumen: manuscrito.resumen || 'Sin resumen disponible',
            referencia: manuscrito.referencia || null,
            contenido: manuscrito.contenido || '',
            fechaEnvio: manuscrito.fechaEnvio || manuscrito.fechaSubida || null,
            // IDs necesarios para notificaciones correctas al editor y autor
            editorId: manuscrito.editorId || manuscrito.editorSeccionId || null,
          }
        })

        // Caché proactivo en background de los PDFs asignados (no completados)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          articulosAsignados.value.forEach(articulo => {
            if (articulo.referencia && articulo.estado !== 'COMPLETADA') {
              navigator.serviceWorker.controller.postMessage({
                tipo: 'CACHE_MANUSCRITO',
                payload: { url: `/api/manuscritos/download/${articulo.referencia}` }
              })
            }
          })
        }
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
      const idx = articulosAsignados.value.findIndex(a => String(a.id) === String(articuloId))
      if (idx !== -1) {
        const articulo = articulosAsignados.value[idx]
        articulo.estado = 'COMPLETADA'
        articulo.revision = revision
        
        // Limpiar de memoria la caché offline para liberar espacio
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller && articulo.referencia) {
          navigator.serviceWorker.controller.postMessage({
            tipo: 'DELETE_MANUSCRITO_CACHE',
            payload: { url: `/api/manuscritos/download/${articulo.referencia}` }
          })
        }
      }
      delete borradores.value[articuloId]
      await idbDel(`borrador_${articuloId}`)
    }
    return res
  }

  async function responderInvitacion(idAsignacion, aceptar) {
    const nuevoEstado = aceptar ? 'ACEPTADO' : 'DECLINADO'
    const res = await actualizarEstadoRevisionApi(idAsignacion, nuevoEstado)
    if (res) {
      const asig = articulosAsignados.value.find(a => a.id === idAsignacion)
      if (asig) {
        asig.estado = aceptar ? 'EN_PROGRESO' : 'DECLINADO'
      }

      // Notificar al editor (fire-and-forget). Si el backend
      // de notificaciones no responde, se silencia: el flujo no se rompe.
      if (asig) {
        try {
          const authStore = useAuthStore()
          const accion = aceptar ? 'aceptó' : 'declinó'
          const tipoNotif = aceptar ? 'INVITACION_ACEPTADA' : 'INVITACION_RECHAZADA'
          
          // Si el manuscrito no tiene editorId guardado, obtener el primer editor del sistema
          let editorDestId = asig.editorId
          if (!editorDestId) {
            try {
              const resEditores = await fetch('/api/usuarios/rol/editor')
              if (resEditores.ok) {
                const editores = await resEditores.json()
                // Preferir editor_jefe si existe, sino el primer editor
                const jefe = editores.find(e => e.roles?.includes('editor_jefe'))
                editorDestId = jefe?.id || editores[0]?.id
              }
            } catch (e2) {
              console.warn('[Revisor] No se pudo resolver el editor:', e2)
            }
          }
          
          if (editorDestId) {
            await crearNotificacionApi({
              destinatarioId: editorDestId,
              tipo: tipoNotif,
              mensaje: `${authStore.usuario?.nombre || 'Un revisor'} ${accion} la invitación a revisar "${asig.titulo}".`,
              referencia_manuscrito: asig.id_manuscrito,
              referencia_asignacion: idAsignacion,
            })
          }
        } catch (e) {
          console.warn(`[Revisor] No se pudo notificar al editor sobre la respuesta:`, e)
        }
      }
    }
    return res
  }

  return { articulosAsignados, cargando, borradores, guardarBorrador, cargarBorrador, cargarDashboard, enviarRevision, responderInvitacion }
})
