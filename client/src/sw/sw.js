/**
 * Service Worker — Patrón Fachada
 *
 * Este archivo actúa como fachada única que unifica:
 *   1. Precaché de assets (Workbox injectManifest)
 *   2. Estrategias de caché por tipo de recurso
 *   3. Sincronización en background (Background Sync API)
 *   4. Notificaciones push (Push API + Notifications API)
 *   5. Interfaz postMessage para comunicación con la app Vue
 *
 * El cliente Vue interactúa únicamente con este SW mediante postMessage,
 * sin acoplarse directamente a Cache API, Sync API ni Push API.
 *
 * Configuración en vite.config.js:
 *   VitePWA({ strategies: 'injectManifest', srcDir: 'src/sw', filename: 'sw.js' })
 */

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { createHandlerBoundToURL } from 'workbox-precaching'

import { cacheFirstStrategy }            from './strategies/CacheFirstStrategy/index.js'
import { networkFirstStrategy }          from './strategies/NetworkFirstStrategy/index.js'
import { staleWhileRevalidateStrategy }  from './strategies/StaleWhileRevalidateStrategy/index.js'
import { encolarSiEsOffline }            from './sync/index.js'
import { handlePush, handleNotificationClick } from './push/index.js'

// ─── 1. PRECACHÉ (inyectado por Workbox en build) ────────────────────────────
if (self.__WB_MANIFEST) {
  precacheAndRoute(self.__WB_MANIFEST)
  cleanupOutdatedCaches()
}

// ─── 2. ESTRATEGIAS DE CACHÉ ─────────────────────────────────────────────────

// Assets estáticos: JS, CSS, fuentes, íconos → Cache First
// En desarrollo (localhost) evitamos Cache First para no interferir con HMR
registerRoute(
  ({ request, url }) => 
    url.hostname !== 'localhost' && (
      request.destination === 'script' ||
      request.destination === 'style'  ||
      request.destination === 'font'   ||
      request.destination === 'image'
    ),
  cacheFirstStrategy
)

// IMPORTANTE: registerRoute es FIFO — la primera regla que matchea gana.
// Por eso las reglas más específicas van ANTES de las genéricas.

// PDFs descargados (binarios estáticos) → Stale While Revalidate (sí cacheable).
registerRoute(
  ({ url, request }) => request.method === 'GET' && url.pathname.endsWith('.pdf'),
  staleWhileRevalidateStrategy
)

// API REST: SIEMPRE pasar por la red (sin cachear) para que GET refleje
// inmediatamente lo que se acaba de crear/modificar en POST/PATCH/DELETE.
// Bug detectado antes: SWR sobre /api/manuscritos servía la lista vieja
// y los nuevos manuscritos NO aparecían tras subirlos.
registerRoute(
  ({ url }) => url.pathname.startsWith('/api') || url.pathname.startsWith('/graphql'),
  networkFirstStrategy
)

// SPA fallback: todas las rutas de navegación sirven index.html
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'))
)

// ─── 3. BACKGROUND SYNC — cola de revisiones y borradores offline ─────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'POST' && request.method !== 'PUT') return
  if (!request.url.includes('/api/')) return

  event.respondWith(
    fetch(request.clone()).catch((error) => encolarSiEsOffline(request, error))
  )
})

// ─── 4. PUSH NOTIFICATIONS ────────────────────────────────────────────────────
self.addEventListener('push', handlePush)
self.addEventListener('notificationclick', handleNotificationClick)

// ─── 5. CICLO DE VIDA ─────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    if (self.location.hostname === 'localhost') console.log('[SW] Instalado')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    if (self.location.hostname === 'localhost') console.log('[SW] Activado')
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Eliminar cachés obsoletos de versiones anteriores
      caches.delete('api-responses-v1'),
    ])
  )
})

// ─── 6. INTERFAZ postMessage (Fachada hacia la app Vue) ──────────────────────
self.addEventListener('message', (event) => {
  const { tipo, payload } = event.data ?? {}

  switch (tipo) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'CACHE_MANUSCRITO':
      // La app solicita pre-cachear un manuscrito antes de ir offline
      event.waitUntil(
        caches.open('manuscritos-cache-v1').then((cache) =>
          cache.add(payload.url)
        )
      )
      break

    case 'GET_VERSION':
      event.source?.postMessage({ tipo: 'VERSION', payload: { version: '1.0.0' } })
      break

    default:
      console.warn('[SW] Mensaje desconocido:', tipo)
  }
})
