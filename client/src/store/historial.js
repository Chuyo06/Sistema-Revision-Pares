import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'rpp_historial_decisiones'

function cargar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.error('[Historial] Error cargando persistencia:', err)
  }
  return []
}

function guardar(lista) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  } catch (err) {
    console.error('[Historial] Error guardando persistencia:', err)
  }
}

export const useHistorialStore = defineStore('historial', () => {
  const eventos = ref(cargar())

  // Devuelve eventos ordenados del más reciente al más antiguo.
  const recientes = computed(() =>
    [...eventos.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  )

  function porManuscrito(manuscritoId) {
    return recientes.value.filter(e => String(e.manuscritoId) === String(manuscritoId))
  }

  /**
   * Registrar una decisión.
   * @param {Object} datos - { manuscritoId, manuscritoTitulo, decision, comentario, plantilla, editorId, editorNombre }
   */
  function registrar(datos) {
    const evento = {
      id: Date.now() + Math.random(),
      fecha: new Date().toISOString(),
      manuscritoId: datos.manuscritoId,
      manuscritoTitulo: datos.manuscritoTitulo || '',
      referencia: datos.referencia || '',
      decision: datos.decision,
      comentario: datos.comentario || '',
      plantilla: datos.plantilla || null,
      editorId: datos.editorId || null,
      editorNombre: datos.editorNombre || 'Editor',
    }
    eventos.value = [evento, ...eventos.value]
    guardar(eventos.value)
    return evento
  }

  function limpiar() {
    eventos.value = []
    guardar(eventos.value)
  }

  return { eventos, recientes, porManuscrito, registrar, limpiar }
})
