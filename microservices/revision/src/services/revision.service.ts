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
      fecha_completada: new Date(),
    });
    return this.obtenerPorId(id);
  }
}
