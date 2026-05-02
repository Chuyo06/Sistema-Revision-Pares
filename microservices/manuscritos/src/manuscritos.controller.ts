import { Controller, Post, Get, Patch, Param, Body, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ManuscritosService } from './manuscritos.service';

import { join } from 'path';
import { Manuscrito } from './entities/manuscrito.entity';

@Controller('manuscritos')
export class ManuscritosController {
  constructor(private readonly manuscritosService: ManuscritosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('archivo', {
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    fileFilter: (_req, file, cb) => {
      if (file.mimetype !== 'application/pdf') {
        cb(new BadRequestException('Solo se permiten archivos PDF'), false);
        return;
      }
      cb(null, true);
    },
  }))
  async uploadPdf(@UploadedFile() archivo: Express.Multer.File) {
    if (!archivo) {
      throw new BadRequestException('No se envió ningún archivo');
    }
    return this.manuscritosService.guardarArchivo(archivo);
  }

  @Get('download/:referencia')
  descargarArchivo(@Param('referencia') referencia: string, @Res() res: any) {
    const filename = referencia.endsWith('.pdf') ? referencia : `${referencia}.pdf`;
    return res.sendFile(join(process.cwd(), 'uploads', filename));
  }

  @Post()
  crear(@Body() datos: Partial<Manuscrito>) {
    return this.manuscritosService.crear(datos);
  }

  @Get()
  obtenerTodos() {
    return this.manuscritosService.obtenerTodos();
  }

  @Get('autor/:autorId')
  obtenerPorAutor(@Param('autorId') autorId: string) {
    const numId = +autorId;
    if (isNaN(numId)) return [];
    return this.manuscritosService.obtenerPorAutor(numId);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    const numId = +id;
    if (isNaN(numId)) return null;
    return this.manuscritosService.obtenerPorId(numId);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: Partial<Manuscrito>) {
    const numId = +id;
    if (isNaN(numId)) return null;
    return this.manuscritosService.actualizar(numId, datos);
  }
}
