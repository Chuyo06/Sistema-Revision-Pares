import { defineStore } from 'pinia'
import { ref, computed, onBeforeUnmount } from 'vue'
import { fetchNotificaciones, marcarNotificacionLeida, crearNotificacionApi } from '@/services/api/notificaciones.js'

export const useNotificacionesStore = defineStore('notificaciones', () => {
  const notificaciones = ref([])
  const cargando = ref(false)
  let pollingInterval = null

  const sinLeer = computed(() => notificaciones.value.filter(n => !n.leida))
  const count = computed(() => sinLeer.value.length)

  async function cargar() {
    cargando.value = true
    const data = await fetchNotificaciones()
    if (data) {
      notificaciones.value = data
    }
    cargando.value = false
  }

  function iniciarPolling() {
    if (pollingInterval) return
    cargar() // Primera carga
    pollingInterval = setInterval(cargar, 30000) // Cada 30 segundos
  }

  function detenerPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  async function agregar(notificacion) {
    // Si queremos persistir en el backend inmediatamente
    const exito = await crearNotificacionApi(notificacion)
    if (exito) {
      await cargar()
    } else {
      // Fallback local si el backend falla
      const nueva = {
        id: Date.now(),
        leida: false,
        timestamp: new Date().toISOString(),
        ...notificacion
      }
      notificaciones.value.unshift(nueva)
    }
  }

  async function marcarLeida(id) {
    const exito = await marcarNotificacionLeida(id)
    if (exito) {
      const notif = notificaciones.value.find(n => String(n.id) === String(id))
      if (notif) notif.leida = true
    }
  }

  async function marcarTodasLeidas() {
    // Implementación simple: marcar una por una o un endpoint bulk si existiera
    for (const n of sinLeer.value) {
      await marcarLeida(n.id)
    }
  }

  function limpiar() {
    notificaciones.value = []
  }

  function agregarNotificacionRevision(manuscrito, revisor) {
    agregar({
      destinatarioId: manuscrito.autorId, // Notificar al autor o al editor?
      tipo: 'REVISION_COMPLETADA',
      titulo: 'Revisión completada',
      mensaje: `${revisor.nombre} completó la revisión de "${manuscrito.titulo}"`,
      ruta: `/editor/asignacion/${manuscrito.id}`
    })
  }

  function agregarNotificacionDecision(manuscrito, decision) {
    const estadoLimpio = decision === 'REQUERIDAS_REVISIONES' ? 'requiere revisiones' : decision.toLowerCase();
    agregar({
      destinatarioId: manuscrito.autorId,
      tipo: 'DECISION_EDITORIAL',
      titulo: 'Decisión Editorial',
      mensaje: `El editor ha tomado una decisión sobre su manuscrito "${manuscrito.titulo}": ${estadoLimpio}`,
      ruta: `/autor/manuscrito/${manuscrito.id}`
    })
  }

  return {
    notificaciones,
    sinLeer,
    count,
    cargando,
    cargar,
    iniciarPolling,
    detenerPolling,
    agregar,
    marcarLeida,
    marcarTodasLeidas,
    limpiar,
    agregarNotificacionRevision,
    agregarNotificacionDecision
  }
})