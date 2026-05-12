/**
 * Background Sync — Cola de reintentos offline
 *
 * Patrón Comando + Cola FIFO:
 * Cada acción ejecutada sin conexión se serializa en IndexedDB.
 * Al recuperar la conexión, el SW procesa la cola con backoff exponencial.
 *
 * Etiquetas de sincronización registradas:
 *   'sync-revisiones'  → EnviarRevisionCommand
 *   'sync-borradores'  → GuardarBorradorCommand
 */

import { Queue } from 'workbox-background-sync'

/** Cola para envío de revisiones completadas offline */
export const revisionesQueue = new Queue('sync-revisiones', {
  maxRetentionTime: 7 * 24 * 60, // retener hasta 7 días (en minutos)
  onSync: async ({ queue }) => {
    let entry
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request)
        if (self.location.hostname === 'localhost') console.log('[SW Sync] Revisión enviada:', entry.request.url)
      } catch {
        await queue.unshiftRequest(entry)
        console.warn('[SW Sync] Sin conexión — revisión reingresada a la cola')
        throw new Error('sync-revisiones fallido, se reintentará')
      }
    }
  },
})

/** Cola para guardado de borradores de revisión */
export const borradoresQueue = new Queue('sync-borradores', {
  maxRetentionTime: 3 * 24 * 60,
  onSync: async ({ queue }) => {
    let entry
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request)
        if (self.location.hostname === 'localhost') console.log('[SW Sync] Borrador sincronizado:', entry.request.url)
      } catch {
        await queue.unshiftRequest(entry)
        throw new Error('sync-borradores fallido, se reintentará')
      }
    }
  },
})

/**
 * Intercepta peticiones fallidas y las encola según el endpoint.
 * Llamar dentro del handler 'fetch' del SW.
 */
export async function encolarSiEsOffline(request, error) {
  if (!navigator.onLine) {
    if (request.url.includes('/revisiones')) {
      await revisionesQueue.pushRequest({ request })
      if (self.location.hostname === 'localhost') console.log('[SW Sync] Revisión encolada para reintento')
    } else if (request.url.includes('/borradores')) {
      await borradoresQueue.pushRequest({ request })
      if (self.location.hostname === 'localhost') console.log('[SW Sync] Borrador encolada para reintento')
    }
  }
  throw error
}
