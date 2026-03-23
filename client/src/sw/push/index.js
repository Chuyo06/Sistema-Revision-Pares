/**
 * Push Notifications — Patrón Observador
 *
 * El servidor notifica eventos del sistema (nueva asignación, dictamen emitido,
 * deadline próximo) mediante Web Push. El SW los recibe y los muestra como
 * notificaciones nativas, incluso si la app está cerrada.
 *
 * Eventos de notificación esperados del servidor:
 *   - NUEVA_ASIGNACION   → al revisor
 *   - DICTAMEN_EMITIDO   → al autor
 *   - DEADLINE_PROXIMO   → al revisor
 *   - REVISION_COMPLETA  → al editor
 *   - ARTICULO_RECIBIDO  → al editor
 */

const ICONS = {
  default:  '/icons/icon-192x192.png',
  badge:    '/icons/badge-72x72.png',
}

const RUTAS = {
  NUEVA_ASIGNACION:  '/revisor/asignados',
  DICTAMEN_EMITIDO:  '/autor/articulos',
  DEADLINE_PROXIMO:  '/revisor/asignados',
  REVISION_COMPLETA: '/editor/dashboard',
  ARTICULO_RECIBIDO: '/editor/articulos/pendientes',
}

/**
 * Maneja el evento 'push' del Service Worker.
 * Registrar con: self.addEventListener('push', handlePush)
 */
export function handlePush(event) {
  const data = event.data?.json() ?? {}

  const { tipo = 'default', titulo = 'Revisión por Pares', cuerpo = '', extra = {} } = data

  const options = {
    body: cuerpo,
    icon: ICONS.default,
    badge: ICONS.badge,
    tag: tipo,
    renotify: true,
    requireInteraction: tipo === 'DEADLINE_PROXIMO',
    data: { url: RUTAS[tipo] ?? '/', ...extra },
    actions: _accionesPorTipo(tipo),
  }

  event.waitUntil(
    self.registration.showNotification(titulo, options)
  )
}

/**
 * Maneja el clic en una notificación.
 * Registrar con: self.addEventListener('notificationclick', handleNotificationClick)
 */
export function handleNotificationClick(event) {
  event.notification.close()

  const url = event.notification.data?.url ?? '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const existente = windowClients.find((c) => c.url.includes(url) && 'focus' in c)
      if (existente) return existente.focus()
      return clients.openWindow(url)
    })
  )
}

function _accionesPorTipo(tipo) {
  if (tipo === 'NUEVA_ASIGNACION') {
    return [
      { action: 'aceptar', title: 'Aceptar revisión' },
      { action: 'rechazar', title: 'Declinar' },
    ]
  }
  if (tipo === 'DEADLINE_PROXIMO') {
    return [{ action: 'ver', title: 'Ver artículo' }]
  }
  return []
}
