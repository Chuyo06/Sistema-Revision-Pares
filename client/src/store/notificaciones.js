import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'rpp_notificaciones'

function cargarPersistidas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persistir(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
}

export const useNotificacionesStore = defineStore('notificaciones', () => {
  const notificaciones = ref(cargarPersistidas())

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
      persistir(notificaciones.value)
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

  function agregarNotificacionRevision(manuscrito, revisor) {
    agregar({
      tipo: 'REVISION_COMPLETADA',
      titulo: 'Revisión completada',
      mensaje: `${revisor.nombre} completó la revisión de "${manuscrito.titulo}"`,
      ruta: `/editor/asignacion/${manuscrito.id}`
    })
  }

  function agregarNotificacionDecision(manuscrito, decision) {
    const labels = { ACEPTADO: 'aceptado', RECHAZADO: 'rechazado', EN_REVISION: 'enviado a revisión' }
    agregar({
      tipo: 'DECISION_EDITORIAL',
      titulo: 'Decisión editorial tomada',
      mensaje: `El manuscrito "${manuscrito.titulo}" fue ${labels[decision] || decision}`,
      ruta: `/editor/asignacion/${manuscrito.id}`
    })
  }

  return {
    notificaciones,
    sinLeer,
    count,
    agregar,
    marcarLeida,
    marcarTodasLeidas,
    limpiar,
    agregarNotificacionRevision,
    agregarNotificacionDecision
  }
})