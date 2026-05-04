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
    return this.asignacionRepo.save(nueva);
  }

  async actualizarEstado(id: number, estado: string) {
    await this.asignacionRepo.update(id, { estado });
    return this.obtenerPorId(id);
  }

  async enviarRevision(id: number, revision: Partial<AsignacionRevision>) {
    await this.asignacionRepo.update(id, {
      estado: 'COMPLETADA',
      puntuacion: revision.puntuacion,
      comentarios: revision.comentarios,
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
