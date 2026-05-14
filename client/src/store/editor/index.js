import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchManuscritos, actualizarEstadoManuscrito, asignarEditorSeccionApi } from '@/services/api/manuscritos.js'
import { fetchUsuarios } from '@/services/api/usuarios.js'
import { fetchAsignacionesGeneral, crearAsignacion, eliminarAsignacionApi } from '@/services/api/revision.js'
import { crearNotificacionApi } from '@/services/api/notificaciones.js'
import { useAuthStore } from '../auth.js'
import { useHistorialStore } from '../historial.js'

// Se eliminó la persistencia manual del historial para usar historialStore

const PLANTILLAS_DECISION = {
  ACEPTADO: [
    { id: 1, texto: 'Estimado/a Autor/a: Nos complace informarle que su manuscrito "{titulo}" ha sido aceptado para publicación. Agradecemos su contribución a nuestra revista.' },
    { id: 2, texto: 'Após revisión por pares, hemos determinado que su trabajo "{titulo}" cumple con los estándares de calidad y originalidad requeridos. Felicitaciones por su aceptación.' },
    { id: 3, texto: 'Su artículo "{titulo}" ha sido seleccionado para publicación. El comité editorial destacó la relevancia y rigor metodológico de su trabajo.' }
  ],
  RECHAZADO: [
    { id: 1, texto: 'Lamentamos informarle que, tras la evaluación de revisores, no podemos aceptar su manuscrito "{titulo}". Los evaluadores encontraron que no cumple con los requisitos de la revista.' },
    { id: 2, texto: 'Después de cuidadosa revisión, el comité editorial ha decidido no proceder con la publicación de "{titulo}". Agradecemos su interés en nuestra revista.' },
    { id: 3, texto: 'Su trabajo "{titulo}" no ha sido aceptado. Los revisores señalan limitaciones en la metodología y contribución al campo que impiden su publicación.' }
  ],
  REQUERIDAS_REVISIONES: [
    { id: 1, texto: 'Solicitamos revisiones menores para "{titulo}". Por favor, considere los comentarios adjuntos y envíe una versión corregida en un plazo de 30 días.' },
    { id: 2, texto: 'El manuscrito "{titulo}" requiere revisiones sustanciales. Los revisores han proporcionado comentarios detallados que deberá abordar para una nueva evaluación.' },
    { id: 3, texto: 'Su artículo "{titulo}" necesita modificaciones antes de una decisión final. Por favor, revise los comentarios de los revisores y someta una versión revisada.' }
  ]
}

export const useEditorStore = defineStore('editor', () => {
  const manuscritosRaw = ref([])
  const revisoresDisponibles = ref([])
  const editoresSeccion = ref([])
  const asignaciones = ref([])
  const cargando = ref(false)

  // Sub-rol activo: en el sistema académico, cualquier usuario con rol 'editor' es editor jefe.
  // 'editor_jefe' y 'editor_seccion' son alias de granularidad futura que aún no están en BD.
  const esEditorJefe = computed(() => {
    const auth = useAuthStore()
    const res = auth.roles.includes('editor_jefe') || (auth.roles.includes('editor') && !auth.roles.includes('editor_seccion'))
    console.log('[EditorStore] esEditorJefe:', res, 'Roles:', auth.roles)
    return res
  })
  const esEditorSeccion = computed(() => {
    const auth = useAuthStore()
    const res = auth.roles.includes('editor_seccion')
    console.log('[EditorStore] esEditorSeccion:', res)
    return res
  })

  // Vista filtrada: editor de sección solo ve los manuscritos asignados a él.
  // Editor jefe (o editor sin sub-rol) ve todo.
  const manuscritos = computed(() => {
    console.log('[EditorStore] Calculando visibles. Jefe:', esEditorJefe.value, 'Seccion:', esEditorSeccion.value)
    if (esEditorJefe.value) return manuscritosRaw.value
    if (esEditorSeccion.value) {
      const auth = useAuthStore()
      const filtrados = manuscritosRaw.value.filter(m => Number(m.editorSeccionId) === Number(auth.usuario?.id))
      console.log('[EditorStore] Visibles para seccion:', filtrados.length)
      return filtrados
    }
    return []
  })

  // Filtros aplicables a las métricas (por convocatoria y rango de fechas).
  const filtros = ref({ convocatoria: 'TODAS', desde: null, hasta: null })

  // Manuscritos filtrados (los visibles tras aplicar el sub-rol Y filtros UI).
  const manuscritosFiltrados = computed(() => {
    return manuscritos.value.filter(m => {
      if (filtros.value.convocatoria !== 'TODAS' && m.convocatoria !== filtros.value.convocatoria) return false
      const fecha = (m.fechaEnvio || m.fechaSubida || '').split('T')[0]
      if (filtros.value.desde && fecha && fecha < filtros.value.desde) return false
      if (filtros.value.hasta && fecha && fecha > filtros.value.hasta) return false
      return true
    })
  })

  function diasEntre(a, b) {
    if (!a || !b) return null
    return Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24))
  }

  const metricas = computed(() => {
    const lista = manuscritosFiltrados.value

    // Tiempo promedio de revisión: días entre fecha_invitacion y fecha_completada de las asignaciones COMPLETADAS.
    const completadas = (asignaciones.value || []).filter(a => a.estado === 'COMPLETADA' && a.fecha_invitacion && a.fecha_completada)
    const tiempos = completadas.map(a => diasEntre(a.fecha_invitacion, a.fecha_completada)).filter(d => d != null && d >= 0)
    const tiempoMedio = tiempos.length ? Math.round(tiempos.reduce((s, d) => s + d, 0) / tiempos.length) : 0

    // Revisores más activos (top 5 por número de asignaciones COMPLETADAS).
    const conteoPorRevisor = (asignaciones.value || [])
      .filter(a => a.estado === 'COMPLETADA')
      .reduce((acc, a) => {
        acc[a.id_revisor] = (acc[a.id_revisor] || 0) + 1
        return acc
      }, {})
    const revisoresMasActivos = Object.entries(conteoPorRevisor)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const revisor = revisoresDisponibles.value.find(r => Number(r.id) === Number(id))
        return { id: Number(id), nombre: revisor?.nombre || `Revisor #${id}`, completadas: count }
      })

    return {
      totalManuscritos: lista.length,
      enRevision: lista.filter(m => m.estado === 'EN_REVISION').length,
      aceptados: lista.filter(m => m.estado === 'ACEPTADO').length,
      rechazados: lista.filter(m => m.estado === 'RECHAZADO').length,
      enviados: lista.filter(m => m.estado === 'ENVIADO').length,
      tasaAceptacion: Math.round(
        (lista.filter(m => m.estado === 'ACEPTADO').length /
          (lista.filter(m => ['ACEPTADO','RECHAZADO'].includes(m.estado)).length || 1)) * 100
      ) || 0,
      tiempoMedioRevision: tiempoMedio,
      revisoresMasActivos,
      revisoresActivos: revisoresDisponibles.value.filter(r => r.estado === 'activo').length,
      alertasPendientes: lista.filter(m => m.estado === 'ENVIADO').length,
    }
  })

  async function cargarDashboardEditor() {
    cargando.value = true
    try {
      const [listManuscritos, listUsuarios, listAsig] = await Promise.all([
        fetchManuscritos(),
        fetchUsuarios(),
        fetchAsignacionesGeneral()
      ])

      if (listManuscritos) {
        manuscritosRaw.value = listManuscritos.map(m => {
          const realId = m._id || m.id;
          const asigsDelArticulo = (listAsig || []).filter(a => String(a.id_manuscrito_mongo) === String(realId))
          return {
            ...m,
            id: realId,
            revisoresAsignados: asigsDelArticulo.length,
            revisionesCompletadas: asigsDelArticulo.filter(a => a.estado === 'COMPLETADA').length,
            alertas: asigsDelArticulo.length === 0 && m.estado === 'ENVIADO' ? ['Requiere asignación de revisores'] : []
          }
        })

        // Backend handle notification for both REVISIONES_COMPLETADAS and NUEVA_VERSION.
        // Therefore, we do not need to emit local notifications based on LISTO_PARA_DECISION anymore.
      }

      if (listUsuarios && Array.isArray(listUsuarios)) {
        const manuscritosConAreas = listManuscritos || []

        revisoresDisponibles.value = listUsuarios
          .filter(u => u.roles?.includes('revisor') && (u.estado?.toUpperCase() === 'ACTIVO' || u.estado === 'ACTIVO'))
          .map(u => {
            const matching = calcularMatchingReal(u, manuscritosConAreas)
            return {
              ...u,
              disponible: true,
              matching,
              especialidades: u.especialidades || u.areasTematicas || inferirEspecialidades(u)
            }
          })

        editoresSeccion.value = listUsuarios.filter(u => u.roles?.includes('editor_seccion'))
      }

      function calcularMatchingReal(revisor, manuscritos) {
        const msEnRevision = manuscritos.filter(m => m.estado === 'EN_REVISION' || m.estado === 'ENVIADO')
        if (msEnRevision.length === 0) return 85

        const areasRevisor = (revisor.especialidades || revisor.areasTematicas || []).map(a => a.toLowerCase())
        if (areasRevisor.length === 0) return 50

        let maxMatch = 0
        for (const ms of msEnRevision) {
          const areasMs = (ms.areasTematicas || ms.areas || []).map(a => a.toLowerCase())
          if (areasMs.length === 0) continue

          const coincidentes = areasMs.filter(a => areasRevisor.some(r => r.includes(a) || a.includes(r))).length
          const match = coincidentes > 0 ? Math.round((coincidentes / areasMs.length) * 100) : 20
          maxMatch = Math.max(maxMatch, match)
        }

        return Math.max(30, Math.min(99, maxMatch || 50))
      }

      function inferirEspecialidades(usuario) {
        const inst = (usuario.institucion || '').toLowerCase()
        if (inst.includes('universidad') || inst.includes('instituto')) return ['Académico', 'Investigación']
        if (inst.includes('hospital') || inst.includes('clínica')) return ['Médico', 'Clínica']
        return ['General']
      }

      if (listAsig) {
        asignaciones.value = listAsig
      }
    } catch (e) {
      console.warn('[Editor] No se pudo cargar el dashboard:', e.message)
    } finally {
      cargando.value = false
    }
  }

  async function asignarRevisor(manuscritoId, revisorId) {
    // Validación: el revisor NO puede ser el autor del artículo.
    const manuscrito = manuscritos.value.find(m => String(m.id) === String(manuscritoId))
    if (manuscrito && Number(manuscrito.autorId) === Number(revisorId)) {
      console.warn('[Editor] No se puede asignar al autor del artículo como revisor')
      return { ok: false, motivo: 'AUTOR_DEL_ARTICULO' }
    }

    const revisor = revisoresDisponibles.value.find(r => Number(r.id) === Number(revisorId))
    const especialidad = revisor?.especialidad || revisor?.especialidades?.join(', ') || null

    const exito = await crearAsignacion(revisorId, manuscritoId, especialidad)
    if (exito) {
      const authStore = useAuthStore()
      const editorId = authStore.usuario?.id || authStore.usuario?.id_usuario

      if (manuscrito && manuscrito.estado === 'ENVIADO') {
        await actualizarEstadoManuscrito(manuscritoId, 'EN_REVISION')
      }
      
      // Guardar el editorId en el manuscrito para que las notificaciones futuras
      // (aceptar/declinar invitación, envío de revisión) lleguen al editor correcto.
      if (editorId && manuscrito && !manuscrito.editorId) {
        try {
          await fetch(`/api/manuscritos/${manuscritoId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ editorId })
          })
          // Actualizar también en el estado local para que el próximo find() lo tenga
          manuscrito.editorId = editorId
        } catch (e) {
          console.warn('[Editor] No se pudo guardar editorId en el manuscrito:', e)
        }
      }

      // Notificar al revisor que ha sido invitado (fire-and-forget).
      try {
        await crearNotificacionApi({
          tipo: 'NUEVA_INVITACION',
          destinatarioId: revisorId,
          mensaje: manuscrito
            ? `Has sido invitado a revisar "${manuscrito.titulo}". Tienes 3 días para responder.`
            : 'Has sido invitado a revisar un nuevo manuscrito.',
          referencia_manuscrito: manuscritoId,
        })
        
        // Notificar al autor que se asignó un revisor
        if (manuscrito && manuscrito.autorId) {
          await crearNotificacionApi({
            tipo: 'REVISOR_ASIGNADO',
            destinatarioId: manuscrito.autorId,
            mensaje: `Se ha asignado un revisor a tu manuscrito "${manuscrito.titulo}".`,
            referencia_manuscrito: manuscritoId,
          })
        }
      } catch (e) {
        console.warn('[Editor] No se pudo notificar asignación:', e)
      }

      await cargarDashboardEditor()
      return { ok: true }
    }
    return { ok: false, motivo: 'BACKEND' }
  }

  async function quitarRevisor(idAsignacion) {
    // Solo se permite si la asignación todavía NO está completada.
    const asig = (asignaciones.value || []).find(a => Number(a.id_asignacion) === Number(idAsignacion))
    if (!asig) return { ok: false, motivo: 'NO_ENCONTRADA' }
    if (asig.estado === 'COMPLETADA') {
      return { ok: false, motivo: 'YA_COMPLETADA' }
    }
    const exito = await eliminarAsignacionApi(idAsignacion)
    if (exito) {
      await cargarDashboardEditor()
      return { ok: true }
    }
    return { ok: false, motivo: 'BACKEND' }
  }

  async function tomarDecision(manuscritoId, decision, extras = {}) {
    // Sólo el editor jefe puede tomar la decisión final.
    if (!esEditorJefe.value) {
      console.warn('[Editor] Solo el editor jefe puede tomar decisiones finales')
      return false
    }
    const exito = await actualizarEstadoManuscrito(manuscritoId, decision, extras.comentario)
    if (exito) {
      // Registrar en historial editorial.
      const auth = useAuthStore()
      const historial = useHistorialStore()
      const m = manuscritosRaw.value.find(x => String(x.id) === String(manuscritoId))
      historial.registrar({
        manuscritoId,
        manuscritoTitulo: m?.titulo || '',
        referencia: m?.referencia || '',
        decision,
        comentario: extras.comentario || '',
        plantilla: extras.plantilla || null,
        editorId: auth.usuario?.id,
        editorNombre: auth.usuario?.nombre,
      })
      
      // Notificar al autor sobre la decisión
      if (m?.autorId) {
        try {
          const labels = { ACEPTADO: 'aceptado', RECHAZADO: 'rechazado', EN_REVISION: 'enviado a revisión' }
          await crearNotificacionApi({
            destinatarioId: m.autorId,
            tipo: 'DECISION_EDITORIAL',
            mensaje: `Se ha tomado una decisión editorial sobre tu manuscrito "${m.titulo}": ha sido ${labels[decision] || decision}.`,
            referencia_manuscrito: manuscritoId
          })
        } catch (e) {
          console.warn('[Editor] No se pudo notificar al autor sobre la decisión:', e)
        }
      }
      
      await cargarDashboardEditor()
    }
    return exito
  }

  async function asignarEditorSeccion(manuscritoId, editorSeccionId) {
    if (!esEditorJefe.value) {
      console.warn('[Editor] Solo el editor jefe puede asignar editores de sección')
      return false
    }
    const exito = await asignarEditorSeccionApi(manuscritoId, editorSeccionId)
    if (exito) await cargarDashboardEditor()
    return exito
  }


  async function tomarDecisionConPlantilla(manuscritoId, decision, plantillaId, personalizada) {
    if (!esEditorJefe.value) {
      console.warn('[Editor] Solo el editor jefe puede tomar decisiones finales')
      return { ok: false }
    }

    const manuscrito = manuscritos.value.find(m => String(m.id) === String(manuscritoId))
    if (!manuscrito) return { ok: false }

    let carta = ''
    if (personalizada) {
      carta = personalizada
    } else if (plantillaId) {
      const plantillas = PLANTILLAS_DECISION[decision] || []
      const t = plantillas.find(p => p.id === plantillaId)
      carta = t ? t.texto.replace('{titulo}', manuscrito.titulo) : ''
    }

    const auth = useAuthStore()
    const historial = useHistorialStore()
    
    historial.registrar({
      manuscritoId: String(manuscritoId),
      manuscritoTitulo: manuscrito.titulo,
      referencia: manuscrito.referencia || '',
      decision,
      comentario: carta || '',
      plantilla: plantillaId || null,
      editorId: auth.usuario?.id,
      editorNombre: auth.usuario?.nombre || 'Editor',
    })

    // Primero confirmar con el backend — solo notificar si tuvo éxito
    const exito = await actualizarEstadoManuscrito(manuscritoId, decision)
    if (exito) {
      try {
        const labels = { ACEPTADO: 'aceptado', RECHAZADO: 'rechazado', EN_REVISION: 'enviado a revisión' }
        await crearNotificacionApi({
          destinatarioId: manuscrito.autorId,
          tipo: 'DECISION_EDITORIAL',
          mensaje: `Se ha tomado una decisión editorial sobre tu manuscrito "${manuscrito.titulo}": ha sido ${labels[decision] || decision}.`,
          referencia_manuscrito: manuscritoId
        })
      } catch (e) {
        console.warn('[Editor] No se pudo notificar al autor sobre la decisión', e)
      }
      await cargarDashboardEditor()
      return { ok: true, carta }
    }
    return { ok: false }
  }

  function getPlantillas(decision) {
    return PLANTILLAS_DECISION[decision] || []
  }

  return {
    manuscritos,
    manuscritosFiltrados,
    filtros,
    revisoresDisponibles,
    editoresSeccion,
    asignaciones,
    metricas,
    cargando,
    esEditorJefe,
    esEditorSeccion,
    rolActivoNombre: computed(() => esEditorJefe.value ? 'Editor en Jefe' : 'Editor de Sección'),
    rolActivoColor: computed(() => esEditorJefe.value ? '#1a237e' : '#2e7d32'),
    rolActivoGradiente: computed(() => esEditorJefe.value 
      ? 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)' 
      : 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'),
    cargarDashboardEditor,
    asignarRevisor,
    quitarRevisor,
    tomarDecision,
    tomarDecisionConPlantilla,
    asignarEditorSeccion,
    getPlantillas,
  }
})
