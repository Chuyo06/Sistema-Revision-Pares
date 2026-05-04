import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchManuscritosPorAutor, fetchBorradoresPorAutor, crearManuscrito, actualizarDatosManuscrito, eliminarManuscrito } from '@/services/api/manuscritos.js'
import { apiFetch } from '@/services/api/client.js'
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
      console.error("Error cargando manuscritos del autor:", e)
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
      console.error('Error cargando borradores del autor:', e)
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
      const payload = {
        referencia: referenciaPdf,
        respuestasRevisores: respuestasRevisores,
        estado: 'LISTO_PARA_DECISION'
      }
      
      const res = await apiFetch(`/api/manuscritos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        await cargarMisManuscritos()
        return true
      }
    } catch (e) {
      console.error('Error reenviando manuscrito:', e)
    }
    return false
  }

  async function cargarComentarios(manuscritoId) {
    try {
      const res = await apiFetch(`/api/revision/manuscrito/${manuscritoId}`)
      if (res.ok) {
        const asignaciones = await res.json()
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
              puntuacion: a.puntuacion
            };
          })
        return { comentarios: comentariosParseados, asignaciones }
      }
    } catch (e) {
      console.error('Error fetching comments:', e)
    }
    return { comentarios: [], asignaciones: [] }
  }


  return { manuscritos, borradores, convocatorias, cargando, cargarMisManuscritos, cargarBorradores, enviarManuscrito, guardarBorrador, eliminarBorrador, cargarComentarios, reenviarManuscrito }
})
