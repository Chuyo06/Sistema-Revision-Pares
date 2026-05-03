import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from '../entities/notificacion.entity';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private notificacionRepo: Repository<Notificacion>,
  ) {}

  async crear(datos: Partial<Notificacion>) {
    const nueva = this.notificacionRepo.create(datos);
    return this.notificacionRepo.save(nueva);
  }

  async obtenerPorDestinatario(destinatarioId: number) {
    return this.notificacionRepo.find({
      where: { destinatarioId },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async marcarComoLeida(id: number) {
    await this.notificacionRepo.update(id, { leida: true });
    return this.notificacionRepo.findOne({ where: { id } });
  }
}
