import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ConvocatoriasService } from './convocatorias.service';
import { Convocatoria } from '../schemas/convocatoria.schema';

@Controller('convocatorias')
export class ConvocatoriasController {
  constructor(private readonly convocatoriasService: ConvocatoriasService) {}

  @Post()
  crear(@Body() datos: Partial<Convocatoria>) {
    return this.convocatoriasService.crear(datos);
  }

  @Get()
  obtenerTodas() {
    return this.convocatoriasService.obtenerTodas();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.convocatoriasService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: Partial<Convocatoria>) {
    return this.convocatoriasService.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.convocatoriasService.eliminar(id);
  }
}
