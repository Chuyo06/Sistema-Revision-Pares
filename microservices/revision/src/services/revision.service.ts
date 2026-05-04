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

  async obtenerPorManuscrito(manuscritoId: number) {
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
      const todasLasAsignaciones = await this.obtenerPorManuscrito(Number(idManuscrito));
      
      const asignacionesActivas = todasLasAsignaciones.filter(a => a.estado !== 'DECLINADO' && a.estado !== 'EXPIRADA');
      const todasCompletadas = asignacionesActivas.length > 0 && asignacionesActivas.every(a => a.estado === 'COMPLETADA');

      if (todasCompletadas) {
        const resManuscrito = await fetch(`http://manuscritos:3000/manuscritos/${idManuscrito}`);
        if (resManuscrito.ok) {
          const manuscrito = await resManuscrito.json();
          
          await fetch(`http://manuscritos:3000/manuscritos/${idManuscrito}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'LISTO_PARA_DECISION' })
          });

          if (manuscrito.editorId) {
            await fetch(`http://notificaciones:3000/notificaciones`, {
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
