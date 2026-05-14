import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchNotificaciones, marcarNotificacionLeida as marcarLeidaApi } from '@/services/api/notificaciones.js'
import { useAuthStore } from './auth.js'

const STORAGE_KEY = 'rpp_notificaciones'

function cargarPersistidas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('[Notificaciones] Error cargando persistencia:', err)
    return []
  }
}

function persistir(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
}

export const useNotificacionesStore = defineStore('notificaciones', () => {
  // Empezar siempre vacío — el backend es la única fuente de verdad.
  // (Se llenará al hacer el primer cargarNotificacionesBackend)
  const notificaciones = ref([])

  const sinLeer = computed(() => notificaciones.value.filter(n => !n.leida))

  const count = computed(() => sinLeer.value.length)

  function agregar(notificacion) {
    const nueva = {
      id: Date.now(),
      leida: false,
      timestamp: new Date().toISOString(),
      ...notificacion
    }
    notificaciones.value.unshift(nueva)
    persistir(notificaciones.value.slice(0, 50))
  }

  function marcarLeida(id) {
    const notif = notificaciones.value.find(n => n.id === id)
    if (notif) {
      notif.leida = true
      if (notif.backendId) {
        marcarLeidaApi(notif.backendId)
      }
      persistir(notificaciones.value)
    }
  }

  // Contador de fallos consecutivos del polling. Si supera el umbral,
  // se auto-detiene para no spammear la consola ni hacer red innecesaria.
  let fallosConsecutivos = 0
  const MAX_FALLOS = 3

  async function cargarNotificacionesBackend(usuarioId) {
    if (!usuarioId) return
    try {
      const delBackend = await fetchNotificaciones(usuarioId)

      // fetchNotificaciones devuelve null cuando el backend no respondió.
      if (delBackend === null) {
        fallosConsecutivos++
        if (fallosConsecutivos >= MAX_FALLOS && pollingInterval) {
          console.warn(`[Notificaciones] Backend no responde tras ${MAX_FALLOS} intentos — deteniendo polling.`)
          detenerPolling()
        }
        return
      }

      // Éxito (puede ser []): reseteamos el contador de fallos.
      fallosConsecutivos = 0

      const authStore = useAuthStore()
      const rolActivoRaw = authStore.rolActivo || 'autor'
      const rolActivo = rolActivoRaw.toLowerCase()

      const roleMap = {
        editor: ['NUEVO_MANUSCRITO', 'INVITACION_ACEPTADA', 'INVITACION_RECHAZADA', 'REVISION_RECIBIDA', 'REVISIONES_COMPLETADAS', 'NUEVA_VERSION'],
        editor_jefe: ['NUEVO_MANUSCRITO', 'INVITACION_ACEPTADA', 'INVITACION_RECHAZADA', 'REVISION_RECIBIDA', 'REVISIONES_COMPLETADAS', 'NUEVA_VERSION'],
        editor_seccion: ['NUEVO_MANUSCRITO', 'INVITACION_ACEPTADA', 'INVITACION_RECHAZADA', 'REVISION_RECIBIDA', 'REVISIONES_COMPLETADAS', 'NUEVA_VERSION'],
        revisor: ['NUEVA_INVITACION', 'NUEVA_INVITACION_REVISION', 'NUEVA_VERSION'],
        autor: ['REVISOR_ASIGNADO', 'REVISION_PARCIAL_COMPLETADA', 'LISTO_PARA_VEREDICTO', 'DECISION_EDITORIAL']
      }

      const allowedTipos = roleMap[rolActivo] || []
      const filtradas = delBackend.filter(b => allowedTipos.includes(b.tipo))

      const nuevas = filtradas.map(b => {
        let titulo = b.tipo.replace(/_/g, ' ')
        let ruta = '/editor/manuscritos'

        if (b.tipo === 'NUEVO_MANUSCRITO') {
          titulo = 'Nuevo Manuscrito'
          ruta = '/editor/manuscritos'
        } else if (b.tipo === 'INVITACION_ACEPTADA') {
          titulo = 'Invitación Aceptada'
          ruta = '/editor/manuscritos'
        } else if (b.tipo === 'INVITACION_RECHAZADA') {
          titulo = 'Invitación Declinada'
          ruta = '/editor/manuscritos'
        } else if (b.tipo === 'REVISION_RECIBIDA') {
          titulo = 'Revisión Recibida'
          ruta = '/editor/manuscritos'
        } else if (b.tipo === 'REVISIONES_COMPLETADAS') {
          titulo = 'Revisiones Completadas'
          ruta = '/editor/manuscritos'
        } else if (b.tipo === 'NUEVA_INVITACION' || b.tipo === 'NUEVA_INVITACION_REVISION') {
          titulo = 'Nueva Invitación a Revisar'
          ruta = '/revisor/asignados'
        } else if (b.tipo === 'NUEVA_VERSION') {
          titulo = 'Nueva Versión Corregida'
          ruta = rolActivo.startsWith('editor') ? '/editor/manuscritos' : '/revisor/asignados'
        } else if (b.tipo === 'REVISOR_ASIGNADO') {
          titulo = 'Revisor Asignado'
          ruta = '/autor/mis-articulos'
        } else if (b.tipo === 'REVISION_PARCIAL_COMPLETADA') {
          titulo = 'Revisión Completada'
          ruta = '/autor/mis-articulos'
        } else if (b.tipo === 'LISTO_PARA_VEREDICTO') {
          titulo = 'Listo para Veredicto'
          ruta = '/autor/mis-articulos'
        } else if (b.tipo === 'DECISION_EDITORIAL') {
          titulo = 'Decisión Editorial'
          ruta = '/autor/mis-articulos'
        }

        return {
          id: `backend_${b.id}`,
          backendId: b.id,
          tipo: b.tipo,
          titulo,
          mensaje: b.mensaje,
          leida: b.leida,
          timestamp: b.fechaCreacion,
          ruta
        }
      })

      // El backend es la única fuente de verdad — reemplazamos completamente.
      notificaciones.value = nuevas
      persistir(nuevas)
    } catch {
      // Esperado cuando el backend de notificaciones está apagado o no responde.
      // No tocamos las notificaciones locales (in-memory + localStorage) para
      // que la UI siga funcionando con la última información disponible.
      console.warn('[Notificaciones] Backend no disponible — solo notificaciones locales.')
    }
  }

  let pollingInterval = null
  function iniciarPolling() {
    if (pollingInterval) return
    // Reset del circuit breaker al (re)iniciar manualmente.
    fallosConsecutivos = 0
    pollingInterval = setInterval(() => {
      const authStore = useAuthStore()
      const usuarioId = authStore.usuario?.id || authStore.usuario?.id_usuario
      if (usuarioId) {
        cargarNotificacionesBackend(usuarioId)
      }
    }, 60000) // Cada minuto
  }

  function detenerPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  function marcarTodasLeidas() {
    notificaciones.value.forEach(n => n.leida = true)
    persistir(notificaciones.value)
  }

  function limpiar() {
    notificaciones.value = []
    persistir([])
  }

  return {
    notificaciones,
    sinLeer,
    count,
    agregar,
    marcarLeida,
    marcarTodasLeidas,
    limpiar,
    cargarNotificacionesBackend,
    iniciarPolling,
    detenerPolling
  }
})

