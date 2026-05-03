import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'rpp_convocatorias'

const SEMILLA = [
  {
    id: 1,
    nombre: 'CIIA 2026 — Congreso Internacional de IA',
    fechaInicio: '2026-03-01',
    fechaLimite: '2026-04-30',
    areasTematicas: ['Inteligencia Artificial', 'Machine Learning', 'NLP'],
  },
  {
    id: 2,
    nombre: 'IoTSec 2026 — Seguridad en IoT',
    fechaInicio: '2026-03-15',
    fechaLimite: '2026-05-15',
    areasTematicas: ['Ciberseguridad', 'IoT'],
  },
  {
    id: 3,
    nombre: 'ISE 2025 — Ingeniería de Software',
    fechaInicio: '2025-09-01',
    fechaLimite: '2025-12-01',
    areasTematicas: ['Ingeniería de Software', 'DevOps'],
  },
]

function cargar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return SEMILLA
}

function guardar(lista) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lista)) } catch {}
}

// Calcula el estado en función de la fecha actual (auto-cierre).
function calcularEstado(c, hoy = new Date()) {
  const limite = new Date(c.fechaLimite + 'T23:59:59')
  return hoy > limite ? 'CERRADA' : 'ABIERTA'
}

export const useConvocatoriasStore = defineStore('convocatorias', () => {
  const lista = ref(cargar())

  // Lista enriquecida con el estado computado dinámicamente (no se persiste).
  const convocatorias = computed(() =>
    lista.value.map(c => ({ ...c, estado: calcularEstado(c) }))
  )

  const abiertas = computed(() => convocatorias.value.filter(c => c.estado === 'ABIERTA'))
  const hayAbiertas = computed(() => abiertas.value.length > 0)

  function porId(id) {
    return convocatorias.value.find(c => c.id === Number(id)) || null
  }

  function porNombre(nombre) {
    return convocatorias.value.find(c => c.nombre === nombre) || null
  }

  function crear(datos) {
    const nuevaId = lista.value.length ? Math.max(...lista.value.map(c => c.id)) + 1 : 1
    const nueva = {
      id: nuevaId,
      nombre: datos.nombre,
      fechaInicio: datos.fechaInicio,
      fechaLimite: datos.fechaLimite,
      areasTematicas: datos.areasTematicas || [],
    }
    lista.value = [...lista.value, nueva]
    guardar(lista.value)
    return nueva
  }

  function actualizar(id, datos) {
    lista.value = lista.value.map(c =>
      c.id === Number(id)
        ? { ...c, ...datos, areasTematicas: datos.areasTematicas ?? c.areasTematicas }
        : c
    )
    guardar(lista.value)
  }

  function eliminar(id) {
    lista.value = lista.value.filter(c => c.id !== Number(id))
    guardar(lista.value)
  }

  return {
    convocatorias, abiertas, hayAbiertas,
    porId, porNombre, crear, actualizar, eliminar,
  }
})
