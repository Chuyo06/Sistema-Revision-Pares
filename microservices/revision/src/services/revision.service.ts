import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsignacionRevision } from '../entities/asignacion-revision.entity';

@Injectable()
export class RevisionService {
  constructor(
    @InjectRepository(AsignacionRevision)
    private asignacionRepo: Repository<AsignacionRevision>,
  ) {}

  async obtenerTodas() {
    return this.asignacionRepo.find({ order: { fecha_invitacion: 'DESC' } });
  }

  async obtenerPorRevisor(revisorId: number) {
    return this.asignacionRepo.find({
      where: { id_revisor: revisorId },
      order: { fecha_invitacion: 'DESC' },
    });
  }

  async obtenerPorManuscrito(manuscritoId: string) {
    return this.asignacionRepo.find({
      where: { id_manuscrito_mongo: manuscritoId.toString() },
    });
  }

  async obtenerPorId(id: number) {
    return this.asignacionRepo.findOne({ where: { id_asignacion: id } });
  }

  async crear(datos: Partial<AsignacionRevision>) {
    const nueva = this.asignacionRepo.create(datos);
    const guardada = await this.asignacionRepo.save(nueva);

    try {
      const resManuscrito = await fetch(`http://manuscritos:3000/manuscritos/${datos.id_manuscrito_mongo}`);
      let titulo = 'un artículo';
      if (resManuscrito.ok) {
        const manuscrito = await resManuscrito.json();
        titulo = manuscrito.titulo || manuscrito.referencia;
      }

      await fetch(`http://notificaciones:3000/notificaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinatarioId: datos.id_revisor,
          tipo: 'NUEVA_INVITACION',
          mensaje: `Has sido invitado a revisar el artículo: "${titulo}".`
        })
      });
    } catch (e) {
      console.error('Error enviando notificación al revisor', e);
    }

    return guardada;
  }

  async actualizarEstado(id: number, estado: string) {
    await this.asignacionRepo.update(id, { estado });
    const asignacionActualizada = await this.obtenerPorId(id);

    if (estado === 'DECLINADO' && asignacionActualizada) {
      try {
        const idManuscrito = asignacionActualizada.id_manuscrito_mongo;
        const resManuscrito = await fetch(`http://manuscritos:3000/manuscritos/${idManuscrito}`);
        if (resManuscrito.ok) {
          const manuscrito = await resManuscrito.json();
          const destinatario = manuscrito.editorId || manuscrito.editorSeccionId || 1;
          
          await fetch(`http://notificaciones:3000/notificaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              destinatarioId: destinatario,
              tipo: 'INVITACION_RECHAZADA',
              mensaje: `Un revisor ha declinado la invitación para revisar "${manuscrito.titulo || manuscrito.referencia}". Por favor, asigna a alguien más.`
            })
          });
        }
      } catch (error) {
        console.error('Error enviando notificación de rechazo:', error);
      }
    }

    return asignacionActualizada;
  }

  /**
   * Reabre las asignaciones COMPLETADAS de un manuscrito para una nueva ronda
   * de revisión, típicamente porque el autor reenvió la versión corregida.
   *
   * - Cambia estado COMPLETADA → ACEPTADO (los revisores las verán como
   *   "en progreso" otra vez en su dashboard).
   * - Limpia fecha_completada para indicar que la ronda actual está abierta.
   * - **Preserva** puntuación y comentarios anteriores: el revisor los ve como
   *   referencia y los sobrescribirá al enviar la nueva revisión.
   * - Notifica a cada revisor afectado (fire-and-forget).
   */
  async reabrirParaRevision(manuscritoId: string) {
    const todas = await this.obtenerPorManuscrito(manuscritoId);
    const reabrir = todas.filter(a => a.estado === 'COMPLETADA');
    if (reabrir.length === 0) return { reabiertas: 0 };

    for (const a of reabrir) {
      // En lugar de actualizar la existente, creamos una NUEVA para la siguiente ronda.
      // Así preservamos el historial de la ronda anterior intacto.
      const nuevaAsignacion = this.asignacionRepo.create({
        id_revisor: a.id_revisor,
        id_manuscrito_mongo: a.id_manuscrito_mongo,
        ronda: (a.ronda || 1) + 1,
        estado: 'ACEPTADO', // Se asume aceptada porque ya la aceptó en la ronda 1
        fecha_invitacion: new Date(),
        fecha_limite: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días para corregida
      });
      await this.asignacionRepo.save(nuevaAsignacion);
    }

    // Notificación a cada revisor (no rompe si el servicio de notificaciones falla).
    try {
      const urlManuscritos = process.env.MS_MANUSCRITOS_URL || 'http://manuscritos:3000';
      const resManuscrito = await fetch(`${urlManuscritos}/manuscritos/${manuscritoId}`);
      const titulo = resManuscrito.ok
        ? (await resManuscrito.json()).titulo || 'un manuscrito'
        : 'un manuscrito';

      const urlNotif = process.env.MS_NOTIFICACIONES_URL || 'http://notificaciones:3000';
      await Promise.allSettled(
        reabrir.map(a => fetch(`${urlNotif}/notificaciones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinatarioId: a.id_revisor,
            tipo: 'NUEVA_VERSION',
            mensaje: `El autor envió una versión corregida de "${titulo}". Por favor revisa tus comentarios y actualiza la evaluación.`,
            referencia_manuscrito: manuscritoId,
          }),
        })),
      );
    } catch (e) {
      console.warn('[Revision] No se pudo notificar reapertura:', e.message);
    }

    return { reabiertas: reabrir.length };
  }

  async enviarRevision(id: number, revision: Partial<AsignacionRevision>) {
    await this.asignacionRepo.update(id, {
      estado: 'COMPLETADA',
      originalidad: revision.originalidad,
      metodologia: revision.metodologia,
      claridad: revision.claridad,
      relevancia: revision.relevancia,
      puntuacion: revision.puntuacion,
      comentarios: revision.comentarios,
      comentarios_editor: revision.comentarios_editor,
      recomendacion: revision.recomendacion,
      fecha_completada: new Date(),
    });
    
    const asignacionActualizada = await this.obtenerPorId(id);
    if (!asignacionActualizada) return null;

    try {
      const idManuscrito = asignacionActualizada.id_manuscrito_mongo;
      const todasLasAsignaciones = await this.obtenerPorManuscrito(idManuscrito);
      
      const asignacionesActivas = todasLasAsignaciones.filter(a => a.estado !== 'DECLINADO' && a.estado !== 'EXPIRADA');
      const todasCompletadas = asignacionesActivas.length > 0 && asignacionesActivas.every(a => a.estado === 'COMPLETADA');

      if (todasCompletadas) {
        const urlManuscritos = process.env.MS_MANUSCRITOS_URL || 'http://manuscritos:3000';
        const resManuscrito = await fetch(`${urlManuscritos}/manuscritos/${idManuscrito}`);
        if (resManuscrito.ok) {
          const manuscrito = await resManuscrito.json();
          
          await fetch(`${urlManuscritos}/manuscritos/${idManuscrito}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'LISTO_PARA_DECISION' })
          });

          if (manuscrito.editorId) {
            const urlNotificaciones = process.env.MS_NOTIFICACIONES_URL || 'http://notificaciones:3000';
            await fetch(`${urlNotificaciones}/notificaciones`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                destinatarioId: manuscrito.editorId,
                tipo: 'REVISIONES_COMPLETADAS',
                mensaje: `Todas las revisiones del manuscrito ${manuscrito.titulo || manuscrito.referencia} han sido completadas. Está listo para decisión.`
              })
            });
          }
        }
      }
    } catch (error) {
      console.error('Error procesando el flujo post-revisión:', error);
    }

    return asignacionActualizada;
  }

  async eliminar(id: number) {
    const asignacion = await this.obtenerPorId(id);
    if (!asignacion) return false;
    await this.asignacionRepo.remove(asignacion);
    return true;
  }
}
