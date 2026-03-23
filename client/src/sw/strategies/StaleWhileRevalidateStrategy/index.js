import { StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

/**
 * Patrón Estrategia — StaleWhileRevalidate
 * Sirve desde caché inmediatamente y actualiza la caché en segundo plano.
 * Uso: manuscritos (PDFs y metadatos) que el revisor necesita leer offline
 * y que deben actualizarse cuando haya conexión disponible.
 */
export const staleWhileRevalidateStrategy = new StaleWhileRevalidate({
  cacheName: 'manuscritos-cache-v1',
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
    }),
  ],
})
