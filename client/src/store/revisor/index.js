import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRevisorStore = defineStore('revisor', () => {
  const articulosAsignados = ref([
    {
      id: 1,
      titulo: 'Aplicación de Redes Neuronales en Diagnóstico Médico',
      autores: 'García, A. et al.',
      convocatoria: 'CIIA 2026',
      deadline: '2026-04-10',
      estado: 'PENDIENTE',
      matching: 92,
      matchingDetalle: 'Alta coincidencia en Deep Learning y Computer Vision. Experiencia moderada en aplicaciones médicas.',
      resumen: 'Este trabajo propone una arquitectura CNN para la clasificación de imágenes histológicas con una precisión del 94.3%.',
    },
    {
      id: 2,
      titulo: 'Transformers para Análisis de Sentimientos en Redes Sociales',
      autores: 'Rodríguez, M. et al.',
      convocatoria: 'CIIA 2026',
      deadline: '2026-04-12',
      estado: 'EN_PROGRESO',
      matching: 88,
      matchingDetalle: 'Muy alta coincidencia en NLP y modelos de lenguaje. Experiencia sólida en análisis de sentimientos.',
      resumen: 'Evaluamos el rendimiento de BERT, RoBERTa y XLNet en datasets de Twitter y Reddit en español.',
    },
    {
      id: 3,
      titulo: 'Compresión de Modelos de IA para Dispositivos Móviles',
      autores: 'Fernández, J. et al.',
      convocatoria: 'IoTSec 2026',
      deadline: '2026-03-30',
      estado: 'COMPLETADA',
      matching: 75,
      matchingDetalle: 'Buena coincidencia en Model Optimization. Poca experiencia en hardware móvil específico.',
      resumen: 'Técnicas de pruning y quantization para desplegar modelos YOLO en dispositivos con menos de 2GB RAM.',
    },
  ])

  const borradores = ref({})

  function guardarBorrador(articuloId, datos) {
    borradores.value[articuloId] = { ...datos, guardadoEn: new Date().toISOString() }
    localStorage.setItem('rpp_borradores', JSON.stringify(borradores.value))
  }

  function cargarBorrador(articuloId) {
    const guardados = JSON.parse(localStorage.getItem('rpp_borradores') || '{}')
    return guardados[articuloId] || null
  }

  function enviarRevision(articuloId, revision) {
    const articulo = articulosAsignados.value.find(a => a.id === articuloId)
    if (articulo) {
      articulo.estado = 'COMPLETADA'
      articulo.revision = revision
      delete borradores.value[articuloId]
      localStorage.setItem('rpp_borradores', JSON.stringify(borradores.value))
    }
  }

  return { articulosAsignados, borradores, guardarBorrador, cargarBorrador, enviarRevision }
})
