import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ManuscritosService } from './manuscritos.service';
import { Manuscrito } from './schemas/manuscrito.schema';
// La ruta tiene que pasar por 'common/decorators' porque así se llama tu carpeta raíz
import { RolesGuard } from './common/decorators/guards/roles.guard';
import { Roles } from './common/decorators/decorators/roles.decorator';
// Si tu controlador está en src/ y la carpeta common está en src/common:

@Controller(['manuscritos']) // Esta es la ruta que Nginx busca
@UseGuards(RolesGuard) 
export class ManuscritosController {
  constructor(private readonly manuscritosService: ManuscritosService) {}

  @Post()
  @Roles('admin') // Dejamos solo 'admin' para PROBAR que nos bloquee
  crear(@Body() datos: Partial<Manuscrito>) {
    return this.manuscritosService.crear(datos);
  }

  @Get()
  obtenerTodos() {
    return this.manuscritosService.obtenerTodos();
  }
}