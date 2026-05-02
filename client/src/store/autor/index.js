import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchManuscritosPorAutor, crearManuscrito } from '@/services/api/manuscritos.js'
import { useAuthStore } from '../auth.js'
import { useConvocatoriasStore } from '../convocatorias.js'

export const useAutorStore = defineStore('autor', () => {
  const manuscritos = ref([])
  const cargando = ref(false)

  // Convocatorias vienen del store compartido (con auto-cierre por fecha).
  const convocatoriasStore = useConvocatoriasStore()
  const convocatorias = computed(() => convocatoriasStore.convocatorias)

  async function cargarMisManuscritos() {
    cargando.value = true
    try {
      const authStore = useAuthStore()
      const userId = authStore.usuario?.id || authStore.usuario?.id_usuario || 1 // Fallback demo
      
      const data = await fetchManuscritosPorAutor(userId)
      if (data) {
        manuscritos.value = data.map(m => ({
          id: m.id,
          titulo: m.titulo,
          resumen: m.resumen,
          estado: m.estado,
          fechaEnvio: m.fechaEnvio ? m.fechaEnvio.split('T')[0] : null,
          convocatoria: m.convocatoria || 'General',
          revisores: 0, // Esto requeriría otro join si quisiéramos mostrarlo real
          revisionesPendientes: 0,
        }))
      }
    } catch (e) {
      console.error("Error cargando manuscritos del autor:", e)
    } finally {
      cargando.value = false
    }
  }

  async function enviarManuscrito(datos) {
    const authStore = useAuthStore()
    const userId = authStore.usuario?.id || authStore.usuario?.id_usuario || 1

    const payload = {
      ...datos,
      autorId: userId,
      autores: authStore.usuario?.nombre || 'Autor Demo',
      referencia: 'PENDIENTE',
      estado: 'ENVIADO'
    }

    const nuevo = await crearManuscrito(payload)
    if (nuevo) {
      await cargarMisManuscritos()
      return nuevo
    }
    return null
  }

  return { manuscritos, convocatorias, cargando, cargarMisManuscritos, enviarManuscrito }
})
