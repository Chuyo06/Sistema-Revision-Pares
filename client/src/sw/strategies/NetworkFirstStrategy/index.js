import { NetworkFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

/**
 * Patrón Estrategia — NetworkFirst
 * Intenta la red primero; si falla (offline), sirve desde caché.
 * Uso: llamadas a la API REST / GraphQL con datos dinámicos
 * (estado de artículos, asignaciones, decisiones del editor).
 */
export const networkFirstStrategy = new NetworkFirst({
  cacheName: 'api-responses-v1',
  networkTimeoutSeconds: 5,
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({
      maxEntries: 200,
      maxAgeSeconds: 24 * 60 * 60, // 1 día
    }),
  ],
})
