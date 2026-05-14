import { Controller, Post, Get, Patch, Delete, Param, Body, Query, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ManuscritosService } from './manuscritos.service';

import { join } from 'path';
import { Manuscrito } from './schemas/manuscrito.schema';

// Prefijo explícito: alinea con nginx (proxy_pass /manuscritos) y con las
// llamadas directas del microservicio de revisión (http://manuscritos:3000/manuscritos/...).
// Sin este prefijo, las rutas paramétricas (:id) podían capturar /convocatorias
// y causar 404 cruzados con ConvocatoriasController.
@Controller('manuscritos')
export class ManuscritosController {
  constructor(private readonly manuscritosService: ManuscritosService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'manuscritos', timestamp: new Date().toISOString() };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('archivo', {
    limits: { fileSize: 5 * 1024 * 1024 },
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
    console.log('[Manuscritos] Archivo recibido para subida:', archivo.originalname);
    return this.manuscritosService.guardarArchivo(archivo);
  }

  @Get('download/:referencia')
  descargarArchivo(@Param('referencia') referencia: string, @Res() res: any) {
    const filename = referencia.endsWith('.pdf') ? referencia : `${referencia}.pdf`;
    const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
    return res.sendFile(join(uploadDir, filename));
  }

  @Get('autor/:autorId/borradores')
  obtenerBorradoresPorAutor(@Param('autorId') autorId: string) {
    const numId = +autorId;
    if (isNaN(numId)) return [];
    return this.manuscritosService.obtenerBorradoresPorAutor(numId);
  }

  @Get('autor/:autorId')
  obtenerPorAutor(
    @Param('autorId') autorId: string,
    @Query('incluirBorradores') incluirBorradores?: string,
  ) {
    const numId = +autorId;
    if (isNaN(numId)) return [];
    const incluir = incluirBorradores === 'true' || incluirBorradores === '1';
    return this.manuscritosService.obtenerPorAutor(numId, incluir);
  }

  @Post()
  crear(@Body() datos: Partial<Manuscrito>) {
    console.log('[Manuscritos] Solicitud de creación recibida:', datos);
    return this.manuscritosService.crear(datos);
  }

  @Get()
  obtenerTodos() {
    return this.manuscritosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.manuscritosService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: Partial<Manuscrito>) {
    return this.manuscritosService.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.manuscritosService.eliminar(id);
  }
}
