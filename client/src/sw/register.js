/**
 * Registro y gestión del ciclo de vida del Service Worker
 *
 * Patrón Estado: gestiona las transiciones de conectividad de la PWA.
 *   ONLINE → OFFLINE → RECONNECTING → SYNCING → ONLINE
 *
 * Uso en main.js:
 *   import { registerSW } from './sw/register.js'
 *   registerSW()
 */

// ─── Estado de conexión (Patrón Estado) ──────────────────────────────────────
export const ConnectionState = Object.freeze({
  ONLINE:        'ONLINE',
  OFFLINE:       'OFFLINE',
  RECONNECTING:  'RECONNECTING',
  SYNCING:       'SYNCING',
})

let _currentState = ConnectionState.ONLINE
const _listeners  = new Set()

export function getConnectionState() {
  return _currentState
}

export function onConnectionStateChange(fn) {
  _listeners.add(fn)
  return () => _listeners.delete(fn)
}

function _setState(newState) {
  if (_currentState === newState) return
  const prev = _currentState
  _currentState = newState
  if (window.location.hostname === 'localhost') console.log(`[SW Register] ${prev} → ${newState}`)
  _listeners.forEach((fn) => fn(newState, prev))
}

// ─── Registro principal ───────────────────────────────────────────────────────
export async function registerSW() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW Register] Service Workers no soportados en este navegador')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    if (window.location.hostname === 'localhost') console.log('[SW Register] Registrado con scope:', registration.scope)

    _watchForUpdates(registration)
    _watchConnectionState()

    return registration
  } catch (error) {
    console.error('[SW Register] Error al registrar:', error)
    return null
  }
}

// ─── Detección de actualizaciones ─────────────────────────────────────────────
function _watchForUpdates(registration) {
  // Nuevo SW instalado y esperando activación
  registration.addEventListener('updatefound', () => {
    const installingWorker = registration.installing
    if (!installingWorker) return

    installingWorker.addEventListener('statechange', () => {
      if (
        installingWorker.state === 'installed' &&
        navigator.serviceWorker.controller
      ) {
        if (window.location.hostname === 'localhost') console.log('[SW Register] Nueva versión disponible')
        _notifyApp({ tipo: 'SW_UPDATE_AVAILABLE' })
      }
    })
  })

  // Cuando un nuevo SW toma control, recargar para aplicar cambios
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (window.location.hostname === 'localhost') console.log('[SW Register] Nuevo SW tomó control — recargando')
    window.location.reload()
  })
}

// ─── Máquina de estados de conexión ──────────────────────────────────────────
function _watchConnectionState() {
  window.addEventListener('online', () => {
    _setState(ConnectionState.RECONNECTING)
    // Pequeña demora para que el SW procese la cola de sincronización
    setTimeout(() => {
      _setState(ConnectionState.SYNCING)
      setTimeout(() => _setState(ConnectionState.ONLINE), 2000)
    }, 500)
  })

  window.addEventListener('offline', () => {
    _setState(ConnectionState.OFFLINE)
  })
}

// ─── Interfaz hacia el SW (Fachada — postMessage) ────────────────────────────
export function sendMessageToSW(message) {
  if (!navigator.serviceWorker.controller) {
    console.warn('[SW Register] No hay SW activo para recibir el mensaje')
    return
  }
  navigator.serviceWorker.controller.postMessage(message)
}

export function skipWaiting() {
  sendMessageToSW({ tipo: 'SKIP_WAITING' })
}

export function cacheManuscrito(url) {
  sendMessageToSW({ tipo: 'CACHE_MANUSCRITO', payload: { url } })
}

// ─── Mensajes entrantes del SW ────────────────────────────────────────────────
navigator.serviceWorker?.addEventListener('message', (event) => {
  const { tipo, payload } = event.data ?? {}
  if (window.location.hostname === 'localhost') console.log('[SW Register] Mensaje del SW:', tipo, payload)
  _notifyApp({ tipo, payload })
})

// ─── Emisor de eventos hacia la app Vue ──────────────────────────────────────
function _notifyApp(detail) {
  window.dispatchEvent(new CustomEvent('sw-message', { detail }))
}
