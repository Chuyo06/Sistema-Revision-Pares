import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RevisionService } from '../services/revision.service';
import { AsignacionRevision } from '../entities/asignacion-revision.entity';

@Controller('revision')
export class RevisionController {
  constructor(private readonly revisionService: RevisionService) {}

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
    const numId = Number(id);
    if (isNaN(numId)) return [];
    return this.revisionService.obtenerPorManuscrito(numId);
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
}
