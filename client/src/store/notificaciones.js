import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchNotificaciones, marcarNotificacionLeida as marcarLeidaApi } from '@/services/api/notificaciones.js'

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
      if (notif.backendId) {
        marcarLeidaApi(notif.backendId)
      }
      persistir(notificaciones.value)
    }
  }

  async function cargarNotificacionesBackend(usuarioId) {
    if (!usuarioId) return
    const delBackend = await fetchNotificaciones(usuarioId)
    
    const nuevas = delBackend.map(b => {
      let titulo = b.tipo.replace('_', ' ')
      let ruta = '/editor/manuscritos'

      if (b.tipo === 'NUEVA_INVITACION') {
        titulo = 'Nueva Invitación'
        ruta = '/revisor/asignados'
      } else if (b.tipo === 'INVITACION_RECHAZADA') {
        titulo = 'Invitación Declinada'
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

    // Conservar las locales para no romper la maqueta del editor
    const locals = notificaciones.value.filter(n => !n.backendId)
    
    // Fusionar y ordenar
    const todas = [...locals, ...nuevas].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
    
    // Para evitar duplicados en la interfaz si se llama varias veces:
    const unicas = Array.from(new Map(todas.map(item => [item.id, item])).values())
    
    notificaciones.value = unicas
    persistir(notificaciones.value)
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
    agregarNotificacionDecision,
    cargarNotificacionesBackend
  }
})