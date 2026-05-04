import { Controller, Get, Post, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { RevisionService } from '../services/revision.service';
import { AsignacionRevision } from '../entities/asignacion-revision.entity';

@Controller()
export class RevisionController {
  constructor(private readonly revisionService: RevisionService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'revision', timestamp: new Date().toISOString() };
  }

  @Get()
  async obtenerAsignaciones(@Query('revisorId') revisorId?: string) {
    if (revisorId) {
      const numId = Number(revisorId);
      if (isNaN(numId)) return [];
      return this.revisionService.obtenerPorRevisor(numId);
    }
    return this.revisionService.obtenerTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId)) return null;
    return this.revisionService.obtenerPorId(numId);
  }

  @Get('manuscrito/:id')
  async obtenerPorManuscrito(@Param('id') id: string) {
    if (!id) return [];
    return this.revisionService.obtenerPorManuscrito(id);
  }

  @Post()
  async crear(@Body() datos: Partial<AsignacionRevision>) {
    return this.revisionService.crear(datos);
  }

  @Post(':id/enviar')
  async enviarRevision(
    @Param('id') id: string,
    @Body() revision: Partial<AsignacionRevision>,
  ) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new Error('ID de asignación inválido');
    }
    return this.revisionService.enviarRevision(numId, revision);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new Error('ID de asignación inválido');
    }
    return this.revisionService.eliminar(numId);
  }

  @Patch(':id/estado')
  async actualizarEstado(@Param('id') id: string, @Body('estado') estado: string) {
    const numId = Number(id);
    if (isNaN(numId)) return null;
    return this.revisionService.actualizarEstado(numId, estado);
  }
}
