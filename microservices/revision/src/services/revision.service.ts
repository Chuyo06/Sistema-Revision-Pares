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
    return guardada;
  }

  async actualizarEstado(id: number, estado: string) {
    await this.asignacionRepo.update(id, { estado });
    const asignacionActualizada = await this.obtenerPorId(id);

    if (estado === 'DECLINADO' && asignacionActualizada) {
      try {
        const idManuscrito = asignacionActualizada.id_manuscrito_mongo;
        const urlManuscritos = process.env.MS_MANUSCRITOS_URL || 'http://manuscritos:3000';
        const urlNotificaciones = process.env.MS_NOTIFICACIONES_URL || 'http://notificaciones:3000';
        const urlUsuarios = process.env.MS_USUARIOS_URL || 'http://usuarios:3000';
        const resManuscrito = await fetch(`${urlManuscritos}/manuscritos/${idManuscrito}`);
        if (resManuscrito.ok) {
          const manuscrito = await resManuscrito.json();
          
          // Resolver editor real; si el manuscrito no tiene editorId, consultar ms_usuarios
          let destinatario = manuscrito.editorId || manuscrito.editorSeccionId;
          if (!destinatario) {
            try {
              const resEditores = await fetch(`${urlUsuarios}/rol/editor`);
              if (resEditores.ok) {
                const editores = await resEditores.json();
                const jefe = editores.find((e: any) => e.roles?.includes('editor_jefe'));
                destinatario = jefe?.id || editores[0]?.id;
              }
            } catch (e2) {
              console.warn('[Revision] No se pudo resolver editor para DECLINADO:', e2);
            }
          }
          
          if (destinatario) {
            await fetch(`${urlNotificaciones}/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                destinatarioId: destinatario,
                tipo: 'INVITACION_RECHAZADA',
                mensaje: `Un revisor ha declinado la invitación para revisar "${manuscrito.titulo || manuscrito.referencia}". Por favor, asigna a alguien más.`
              })
            });
          }
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
        reabrir.map(a => fetch(`${urlNotif}/`, {
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
      const urlManuscritos = process.env.MS_MANUSCRITOS_URL || 'http://manuscritos:3000';
      const urlNotificaciones = process.env.MS_NOTIFICACIONES_URL || 'http://notificaciones:3000';
      const urlUsuarios = process.env.MS_USUARIOS_URL || 'http://usuarios:3000';
      
      const resManuscrito = await fetch(`${urlManuscritos}/manuscritos/${idManuscrito}`);
      if (resManuscrito.ok) {
        const manuscrito = await resManuscrito.json();
        
        // Resolver el editor destinatario: primero del manuscrito, si no consultar ms_usuarios
        let destinatario = manuscrito.editorId || manuscrito.editorSeccionId;
        if (!destinatario) {
          try {
            const resEditores = await fetch(`${urlUsuarios}/rol/editor`);
            if (resEditores.ok) {
              const editores = await resEditores.json();
              const jefe = editores.find((e: any) => e.roles?.includes('editor_jefe'));
              destinatario = jefe?.id || editores[0]?.id;
            }
          } catch (e2) {
            console.warn('[Revision] No se pudo resolver editor desde ms_usuarios:', e2);
          }
        }
        
        // Contar cuántas revisiones están completadas para el mensaje al autor
        const todasLasAsignaciones = await this.obtenerPorManuscrito(idManuscrito);
        const asignacionesActivas = todasLasAsignaciones.filter(a => a.estado !== 'DECLINADO' && a.estado !== 'EXPIRADA');
        const completadas = asignacionesActivas.filter(a => a.estado === 'COMPLETADA').length;
        const total = asignacionesActivas.length;
        const todasCompletadas = total > 0 && completadas === total;
        
        // 1. Notificación individual al editor (Siempre que un revisor termina)
        if (destinatario) {
          await fetch(`${urlNotificaciones}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              destinatarioId: destinatario,
              tipo: 'REVISION_RECIBIDA',
              mensaje: `Un revisor acaba de enviar su evaluación para el manuscrito: "${manuscrito.titulo || manuscrito.referencia}" (${completadas}/${total} revisiones completadas).`
            })
          });
        }
        
        // 2. Notificar al autor con conteo específico
        if (manuscrito.autorId && !todasCompletadas) {
          const conteoMsg = total === 1
            ? `Un revisor ha completado la evaluación de tu manuscrito "${manuscrito.titulo || manuscrito.referencia}".`
            : `${completadas} de ${total} revisores han completado la evaluación de tu manuscrito "${manuscrito.titulo || manuscrito.referencia}".`;
          await fetch(`${urlNotificaciones}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              destinatarioId: manuscrito.autorId,
              tipo: 'REVISION_PARCIAL_COMPLETADA',
              mensaje: conteoMsg
            })
          });
        }

        // 3. Si TODAS las revisiones están completadas
        if (todasCompletadas) {
          await fetch(`${urlManuscritos}/manuscritos/${idManuscrito}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'LISTO_PARA_DECISION' })
          });

          if (destinatario) {
            await fetch(`${urlNotificaciones}/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                destinatarioId: destinatario,
                tipo: 'REVISIONES_COMPLETADAS',
                mensaje: `Todas las revisiones del manuscrito "${manuscrito.titulo || manuscrito.referencia}" han sido completadas. Está listo para decisión.`
              })
            });
          }
          
          // Notificar al autor que todas las revisiones terminaron
          if (manuscrito.autorId) {
            await fetch(`${urlNotificaciones}/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                destinatarioId: manuscrito.autorId,
                tipo: 'LISTO_PARA_VEREDICTO',
                mensaje: `Todos los ${total} revisores de tu manuscrito "${manuscrito.titulo || manuscrito.referencia}" han completado sus evaluaciones. Está a la espera del veredicto editorial.`
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
