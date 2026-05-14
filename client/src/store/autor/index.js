import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchManuscritosPorAutor, fetchBorradoresPorAutor, crearManuscrito, actualizarDatosManuscrito, eliminarManuscrito } from '@/services/api/manuscritos.js'
import { fetchAsignacionesPorManuscrito, reabrirRevisionesApi } from '@/services/api/revision.js'
import { crearNotificacionApi } from '@/services/api/notificaciones.js'
import { useAuthStore } from '../auth.js'
import { useConvocatoriasStore } from '../convocatorias.js'

function mapManuscrito(m) {
  return {
    id: m._id || m.id,
    titulo: m.titulo,
    resumen: m.resumen,
    contenido: m.contenido,
    autores: m.autores,
    referencia: m.referencia,
    estado: m.estado,
    motivoRechazo: m.motivoRechazo,
    fechaEnvio: m.fechaEnvio ? String(m.fechaEnvio).split('T')[0]
              : m.fechaSubida ? String(m.fechaSubida).split('T')[0]
              : null,
    fechaSubida: m.fechaSubida,
    fechaDecision: m.fechaDecision,
    convocatoria: m.convocatoria || 'General',
    respuestasRevisores: m.respuestasRevisores,
    revisores: m.revisoresAsignados || 0,
    revisionesPendientes: Math.max(0, (m.revisoresAsignados || 0) - (m.revisionesCompletadas || 0)),
  }
}

export const useAutorStore = defineStore('autor', () => {
  const manuscritos = ref([])  // solo enviados (no borradores)
  const borradores  = ref([])
  const cargando = ref(false)

  // Convocatorias vienen del store compartido (con auto-cierre por fecha).
  const convocatoriasStore = useConvocatoriasStore()
  const convocatorias = computed(() => convocatoriasStore.convocatorias)

  async function cargarMisManuscritos() {
    cargando.value = true
    try {
      const authStore = useAuthStore()
      const userId = authStore.usuario?.id || authStore.usuario?.id_usuario
      if (userId == null) {
        console.warn('[Autor] No hay userId en el store de auth. ¿La sesión expiró?')
        manuscritos.value = []
        return
      }

      const data = await fetchManuscritosPorAutor(userId)
      if (data) {
        manuscritos.value = data.map(mapManuscrito)
      } else {
        console.warn('[Autor] El backend no devolvió manuscritos (data=null)')
      }
    } catch (e) {
      console.warn('[Autor] No se pudieron cargar los manuscritos:', e.message)
    } finally {
      cargando.value = false
    }
  }

  async function cargarBorradores() {
    cargando.value = true
    try {
      const authStore = useAuthStore()
      const userId = authStore.usuario?.id || authStore.usuario?.id_usuario
      if (userId == null) {
        borradores.value = []
        return
      }
      const data = await fetchBorradoresPorAutor(userId)
      if (data) {
        borradores.value = data.map(mapManuscrito)
      } else {
        console.warn('[Autor] El backend no devolvió borradores (data=null)')
      }
    } catch (e) {
      console.warn('[Autor] No se pudieron cargar los borradores:', e.message)
    } finally {
      cargando.value = false
    }
  }

  async function enviarManuscrito(datos, id = null) {
    const authStore = useAuthStore()
    const userId = authStore.usuario?.id || authStore.usuario?.id_usuario
    if (userId == null) {
      throw new Error('No hay sesión activa. Inicia sesión nuevamente.')
    }

    const payload = {
      ...datos,
      autorId: Number(userId),
      autores: authStore.usuario?.nombre,
      // No enviar 'PENDIENTE' como referencia: el backend la generará si falta.
      referencia: datos.referencia && datos.referencia !== 'PENDIENTE' ? datos.referencia : undefined,
      estado: 'ENVIADO',
    }

    if (id) {
      const exito = await actualizarDatosManuscrito(id, payload)
      if (!exito) throw new Error('El backend no pudo actualizar el manuscrito.')
      await cargarMisManuscritos()
      return { id }
    }

    // crearManuscrito lanza si falla; si tiene éxito devuelve el documento creado.
    const nuevo = await crearManuscrito(payload)
    if (!nuevo) throw new Error('Respuesta vacía del backend al crear manuscrito.')
    await cargarMisManuscritos()
    return nuevo
  }

  async function guardarBorrador(datos, id = null) {
    const authStore = useAuthStore()
    const userId = authStore.usuario?.id || authStore.usuario?.id_usuario

    const payload = {
      ...datos,
      autorId: Number(userId),
      autores: authStore.usuario?.nombre,
      referencia: datos.referencia || null,
      estado: 'BORRADOR'
    }

    if (id) {
      const exito = await actualizarDatosManuscrito(id, payload)
      if (exito) {
        await cargarBorradores()
        return { id }
      }
      return null
    } else {
      const nuevo = await crearManuscrito(payload)
      if (nuevo) {
        await cargarBorradores()
        return nuevo
      }
      return null
    }
  }

  async function eliminarBorrador(id) {
    const exito = await eliminarManuscrito(id)
    if (exito) {
      await cargarBorradores()
      return true
    }
    return false
  }

  async function reenviarManuscrito(id, referenciaPdf, respuestasRevisores) {
    try {
      // Al reenviar el manuscrito vuelve a estado EN_REVISION, no
      // LISTO_PARA_DECISION, porque las revisiones se reabren para una nueva
      // ronda. Solo pasará a LISTO_PARA_DECISION cuando todos los revisores
      // completen la nueva revisión (lo hace el microservicio de revision).
      const exito = await actualizarDatosManuscrito(id, {
        referencia: referenciaPdf,
        respuestasRevisores: respuestasRevisores,
        estado: 'EN_REVISION',
      })

      if (exito) {
        // Reabrir las asignaciones COMPLETADAS del manuscrito para que los
        // revisores puedan evaluar la versión corregida. Fire-and-forget.
        try {
          await reabrirRevisionesApi(id)
        } catch (e) {
          console.warn('[Autor] No se pudieron reabrir las revisiones:', e.message)
        }

        // Notificar a los editores que el autor reenvió la versión corregida.
        try {
          const authStore = useAuthStore()
          const manuscrito = manuscritos.value.find(m => String(m.id) === String(id))
          await crearNotificacionApi({
            tipo: 'NUEVA_VERSION',
            rol_destinatario: 'editor',
            mensaje: `${authStore.usuario?.nombre || 'El autor'} reenvió la versión corregida de "${manuscrito?.titulo || 'un manuscrito'}". Los revisores ya pueden re-evaluarla.`,
            referencia_manuscrito: id,
          })
        } catch (e) {
          console.warn('[Autor] No se pudo notificar a los editores sobre el reenvío:', e)
        }

        await cargarMisManuscritos()
        return true
      }
    } catch (e) {
      console.warn('[Autor] No se pudo reenviar el manuscrito:', e.message)
    }
    return false
  }

  async function cargarComentarios(manuscritoId) {
    try {
      const asignaciones = await fetchAsignacionesPorManuscrito(manuscritoId)
      if (Array.isArray(asignaciones)) {
        const comentariosParseados = asignaciones
          .filter(a => a.estado === 'COMPLETADA' && a.comentarios)
          .map((a, index) => {
            let texto = a.comentarios || '';
            const markerAutor = 'PARA EL AUTOR: ';
            const markerEditor = 'PARA EL EDITOR: ';
            
            if (texto.includes(markerAutor)) {
              const idxAutor = texto.indexOf(markerAutor) + markerAutor.length;
              const idxEditor = texto.indexOf(markerEditor);
              
              if (idxEditor !== -1 && idxEditor > idxAutor) {
                texto = texto.substring(idxAutor, idxEditor).trim();
              } else {
                texto = texto.substring(idxAutor).trim();
              }
            }
            
            return {
              id: index + 1,
              comentarios: texto,
              puntuacion: a.puntuacion,
              originalidad: a.originalidad,
              metodologia: a.metodologia,
              claridad: a.claridad,
              relevancia: a.relevancia,
              ronda: a.ronda,
              especialidad: a.especialidad_revisor || null,
            };
          })
        return { comentarios: comentariosParseados, asignaciones }
      }
    } catch (e) {
      console.warn('[Autor] No se pudieron cargar los comentarios:', e.message)
    }
    return { comentarios: [], asignaciones: [] }
  }


  return { manuscritos, borradores, convocatorias, cargando, cargarMisManuscritos, cargarBorradores, enviarManuscrito, guardarBorrador, eliminarBorrador, cargarComentarios, reenviarManuscrito }
})
