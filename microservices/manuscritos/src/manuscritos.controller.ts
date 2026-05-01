import { Controller, Post, Get, Patch, Param, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ManuscritosService } from './manuscritos.service';
// 1. Apuntamos al Schema de MongoDB, no a la entidad de MariaDB
import { Manuscrito } from './schemas/manuscrito.schema';
import { CreateManuscritoDto } from './dto/create-manuscrito.dto';

@Controller('manuscripts') // 2. Cumplimos el nombre exacto de la Tarea 4
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

  // 🔥 ESTE ES EL ENDPOINT DE TU TAREA 4 🔥
  @Post()
  crear(@Body() datos: CreateManuscritoDto) {
    return this.manuscritosService.crear(datos);
  }

  @Get()
  obtenerTodos() {
    return this.manuscritosService.obtenerTodos();
  }

  @Get('autor/:autorId')
  obtenerPorAutor(@Param('autorId') autorId: string) {
    // Aquí SÍ convertimos a número porque el autorId es el ID del Usuario de MariaDB
    const numId = +autorId;
    if (isNaN(numId)) return [];
    return this.manuscritosService.obtenerPorAutor(numId);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    // 3. Quitamos la conversión a número. El ID de MongoDB se pasa como string
    return this.manuscritosService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: Partial<Manuscrito>) {
    // Igual aquí, el ID de MongoDB se pasa intacto
    return this.manuscritosService.actualizar(id, datos);
  }
}