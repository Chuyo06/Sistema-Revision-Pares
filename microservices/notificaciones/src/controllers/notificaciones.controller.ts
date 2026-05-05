import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificacionesService } from '../services/notificaciones.service';
import { Notificacion } from '../entities/notificacion.entity';

@Controller()
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}
  
  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'notificaciones', timestamp: new Date().toISOString() };
  }

  @Post()
  async crear(@Body() datos: Partial<Notificacion>) {
    return this.notificacionesService.crear(datos);
  }

  @Get('usuario/:id')
  async obtenerPorDestinatario(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId)) return [];
    return this.notificacionesService.obtenerPorDestinatario(numId);
  }

  @Patch(':id/leida')
  async marcarComoLeida(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId)) return null;
    return this.notificacionesService.marcarComoLeida(numId);
  }
}
