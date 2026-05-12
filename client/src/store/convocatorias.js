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
      // Si el backend está caído fetchConvocatorias devuelve [] (no lanza).
      // Solo sobrescribimos la lista cuando recibimos algo válido para no
      // borrar datos previos en una recarga intermitente.
      lista.value = Array.isArray(data) ? data : []
    } catch (e) {
      // Esperado cuando el gateway no está disponible. La UI mostrará
      // "No hay convocatorias creadas" como estado vacío natural.
      console.warn('[Convocatorias] Backend no disponible — usando lista vacía.')
      lista.value = []
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

  // En crear/actualizar/eliminar dejamos que el error suba al componente
  // (que lo muestra como snackbar). NO duplicamos el log aquí: el service
  // ya devuelve un Error con mensaje limpio listo para mostrar al usuario.
  async function crear(datos) {
    const nueva = await crearConvocatoria(datos)
    lista.value.unshift(nueva)
    return nueva
  }

  async function actualizar(id, datos) {
    const c = await actualizarConvocatoria(id, datos)
    lista.value = lista.value.map(item => String(item._id) === String(id) ? c : item)
    return c
  }

  async function eliminar(id) {
    await eliminarConvocatoria(id)
    lista.value = lista.value.filter(c => String(c._id) !== String(id))
  }

  // Auto-cargar al instanciar el store
  cargar()

  return {
    convocatorias, abiertas, hayAbiertas, cargando,
    cargar, porId, porNombre, crear, actualizar, eliminar,
  }
})
