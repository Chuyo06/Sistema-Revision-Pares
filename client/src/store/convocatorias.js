import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchConvocatorias, crearConvocatoria, actualizarConvocatoria, eliminarConvocatoria } from '@/services/api/convocatorias.js'

// Calcula el estado en función de la fecha actual (auto-cierre).
function calcularEstado(c, hoy = new Date()) {
  const limite = new Date(c.fechaLimite + 'T23:59:59')
  return hoy > limite ? 'CERRADA' : 'ABIERTA'
}

export const useConvocatoriasStore = defineStore('convocatorias', () => {
  const lista = ref([])
  const cargando = ref(false)

  // Lista enriquecida con el estado computado dinámicamente (no se persiste).
  const convocatorias = computed(() =>
    lista.value.map(c => ({ ...c, id: c._id, estado: calcularEstado(c) }))
  )

  const abiertas = computed(() => convocatorias.value.filter(c => c.estado === 'ABIERTA'))
  const hayAbiertas = computed(() => abiertas.value.length > 0)

  async function cargar() {
    cargando.value = true
    try {
      const data = await fetchConvocatorias()
      lista.value = data
    } catch (e) {
      console.error('Error al cargar convocatorias', e)
    } finally {
      cargando.value = false
    }
  }

  function porId(id) {
    return convocatorias.value.find(c => String(c.id) === String(id)) || null
  }

  function porNombre(nombre) {
    return convocatorias.value.find(c => c.nombre === nombre) || null
  }

  async function crear(datos) {
    try {
      const nueva = await crearConvocatoria(datos)
      lista.value.unshift(nueva)
      return nueva
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async function actualizar(id, datos) {
    try {
      const c = await actualizarConvocatoria(id, datos)
      lista.value = lista.value.map(item => String(item._id) === String(id) ? c : item)
      return c
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async function eliminar(id) {
    try {
      await eliminarConvocatoria(id)
      lista.value = lista.value.filter(c => String(c._id) !== String(id))
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  // Auto-cargar al instanciar el store
  cargar()

  return {
    convocatorias, abiertas, hayAbiertas, cargando,
    cargar, porId, porNombre, crear, actualizar, eliminar,
  }
})
