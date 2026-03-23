import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEditorStore = defineStore('editor', () => {
  const manuscritos = ref([
    {
      id: 1, titulo: 'Aplicación de Redes Neuronales en Diagnóstico Médico',
      autores: 'García, A., Torres, B.', convocatoria: 'CIIA 2026',
      estado: 'EN_REVISION', fechaEnvio: '2026-01-15',
      revisoresAsignados: 3, revisionesCompletadas: 2,
      alertas: ['Posible conflicto de interés: Revisor #2 coautor en 2024'],
    },
    {
      id: 2, titulo: 'Transformers para Análisis de Sentimientos',
      autores: 'Rodríguez, M., Díaz, C.', convocatoria: 'CIIA 2026',
      estado: 'EN_REVISION', fechaEnvio: '2026-01-20',
      revisoresAsignados: 2, revisionesCompletadas: 1,
      alertas: [],
    },
    {
      id: 3, titulo: 'Framework para Pruebas de Microservicios con IA',
      autores: 'López, C., Sanz, R.', convocatoria: 'CIIA 2026',
      estado: 'ACEPTADO', fechaEnvio: '2025-11-10',
      revisoresAsignados: 3, revisionesCompletadas: 3,
      alertas: [],
    },
    {
      id: 4, titulo: 'Optimización de Consultas SQL con Algoritmos Genéticos',
      autores: 'Martín, E.', convocatoria: 'BDIS 2025',
      estado: 'RECHAZADO', fechaEnvio: '2025-09-01',
      revisoresAsignados: 2, revisionesCompletadas: 2,
      alertas: [],
    },
    {
      id: 5, titulo: 'Detección de Anomalías en Redes IoT',
      autores: 'Pérez, L., Gómez, A.', convocatoria: 'IoTSec 2026',
      estado: 'ENVIADO', fechaEnvio: '2026-02-01',
      revisoresAsignados: 0, revisionesCompletadas: 0,
      alertas: ['Requiere asignación de revisores'],
    },
  ])

  const revisoresDisponibles = ref([
    { id: 1, nombre: 'Dr. Carlos López', especialidades: ['Machine Learning', 'Computer Vision'], matching: 92, disponible: true },
    { id: 2, nombre: 'Dra. María Fernández', especialidades: ['NLP', 'Deep Learning'], matching: 88, disponible: true },
    { id: 3, nombre: 'Dr. Javier Torres', especialidades: ['IoT', 'Security', 'Edge Computing'], matching: 81, disponible: false },
    { id: 4, nombre: 'Prof. Laura Sánchez', especialidades: ['Databases', 'Optimization', 'SQL'], matching: 76, disponible: true },
    { id: 5, nombre: 'Dr. Andrés Morales', especialidades: ['Mobile Computing', 'Model Compression'], matching: 70, disponible: true },
  ])

  const metricas = computed(() => ({
    totalManuscritos: manuscritos.value.length,
    enRevision: manuscritos.value.filter(m => m.estado === 'EN_REVISION').length,
    aceptados: manuscritos.value.filter(m => m.estado === 'ACEPTADO').length,
    rechazados: manuscritos.value.filter(m => m.estado === 'RECHAZADO').length,
    enviados: manuscritos.value.filter(m => m.estado === 'ENVIADO').length,
    tasaAceptacion: Math.round(
      (manuscritos.value.filter(m => m.estado === 'ACEPTADO').length /
        manuscritos.value.filter(m => ['ACEPTADO','RECHAZADO'].includes(m.estado)).length) * 100
    ) || 0,
    tiempoMedioRevision: 18,
    revisoresActivos: 12,
    alertasPendientes: manuscritos.value.reduce((acc, m) => acc + m.alertas.length, 0),
  }))

  function asignarRevisor(manuscritoId, revisorId) {
    const manuscrito = manuscritos.value.find(m => m.id === manuscritoId)
    if (manuscrito && manuscrito.estado === 'ENVIADO') {
      manuscrito.estado = 'EN_REVISION'
    }
    if (manuscrito) manuscrito.revisoresAsignados++
  }

  function tomarDecision(manuscritoId, decision) {
    const manuscrito = manuscritos.value.find(m => m.id === manuscritoId)
    if (manuscrito) manuscrito.estado = decision
  }

  return { manuscritos, revisoresDisponibles, metricas, asignarRevisor, tomarDecision }
})
