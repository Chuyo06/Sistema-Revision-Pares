import { CacheFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

/**
 * Patrón Estrategia — CacheFirst
 * Sirve desde caché; solo consulta la red si el recurso no existe en caché.
 * Uso: assets estáticos (JS, CSS, fuentes, íconos) que cambian con cada build.
 */
export const cacheFirstStrategy = new CacheFirst({
  cacheName: 'static-assets-v1',
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
    }),
  ],
})
