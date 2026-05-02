import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchManuscritosPorAutor, crearManuscrito, actualizarDatosManuscrito, eliminarManuscrito } from '@/services/api/manuscritos.js'
import { useAuthStore } from '../auth.js'

export const useAutorStore = defineStore('autor', () => {
  const manuscritos = ref([])
  const cargando = ref(false)

  const convocatorias = ref([
    { id: 1, nombre: 'CIIA 2026 — Congreso Internacional de IA', deadline: '2026-04-30', estado: 'ABIERTA' },
    { id: 2, nombre: 'IoTSec 2026 — Seguridad en IoT', deadline: '2026-05-15', estado: 'ABIERTA' },
    { id: 3, nombre: 'ISE 2025 — Ingeniería de Software', deadline: '2025-12-01', estado: 'CERRADA' },
  ])

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
          fechaEnvio: m.fechaEnvio ? m.fechaEnvio.split('T')[0] : null,
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
        return asignaciones
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
      }
    } catch (e) {
      console.error('Error fetching comments:', e)
    }
    return []
  }

  return { manuscritos, convocatorias, cargando, cargarMisManuscritos, enviarManuscrito, guardarBorrador, eliminarBorrador, cargarComentarios, reenviarManuscrito }
})
