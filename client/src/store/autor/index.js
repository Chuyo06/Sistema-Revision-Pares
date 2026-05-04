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
          motivoRechazo: m.motivoRechazo,
          fechaEnvio: m.fechaEnvio ? m.fechaEnvio.split('T')[0] : null,
          fechaDecision: m.fechaDecision,
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

  async function enviarManuscrito(datos, id = null) {
    const authStore = useAuthStore()
    const userId = authStore.usuario?.id || authStore.usuario?.id_usuario || 1

    const payload = {
      ...datos,
      autorId: userId,
      autores: authStore.usuario?.nombre || 'Autor Demo',
      referencia: datos.referencia || 'PENDIENTE',
      estado: 'ENVIADO'
    }

    if (id) {
      const exito = await actualizarDatosManuscrito(id, payload)
      if (exito) {
        await cargarMisManuscritos()
        return { id }
      }
      return null
    } else {
      const nuevo = await crearManuscrito(payload)
      if (nuevo) {
        await cargarMisManuscritos()
        return nuevo
      }
      return null
    }
  }

  async function guardarBorrador(datos, id = null) {
    const authStore = useAuthStore()
    const userId = authStore.usuario?.id || authStore.usuario?.id_usuario || 1

    const payload = {
      ...datos,
      autorId: userId,
      autores: authStore.usuario?.nombre || 'Autor Demo',
      referencia: datos.referencia || null,
      estado: 'BORRADOR'
    }

    if (id) {
      const exito = await actualizarDatosManuscrito(id, payload)
      if (exito) {
        await cargarMisManuscritos()
        return { id }
      }
      return null
    } else {
      const nuevo = await crearManuscrito(payload)
      if (nuevo) {
        await cargarMisManuscritos()
        return nuevo
      }
      return null
    }
  }

  async function eliminarBorrador(id) {
    const exito = await eliminarManuscrito(id)
    if (exito) {
      await cargarMisManuscritos()
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
      
      const res = await fetch(`/api/manuscritos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`/api/revision/manuscrito/${manuscritoId}`)
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
              puntuacion: a.puntuacion,
              originalidad: a.originalidad,
              metodologia: a.metodologia,
              claridad: a.claridad,
              relevancia: a.relevancia
            };
          })
        return { comentarios: comentariosParseados, asignaciones }
      }
    } catch (e) {
      console.error('Error fetching comments:', e)
    }
    return { comentarios: [], asignaciones: [] }
  }

  return { manuscritos, convocatorias, cargando, cargarMisManuscritos, enviarManuscrito, guardarBorrador, eliminarBorrador, cargarComentarios, reenviarManuscrito }
})
