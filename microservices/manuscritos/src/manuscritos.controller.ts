import { Controller, Post, Get, Body, All, Req } from '@nestjs/common';
import { ManuscritosService } from './manuscritos.service';
import { Manuscrito } from './schemas/manuscrito.schema';

@Controller() // Lo dejamos vacío para que el microservicio sea la base
export class ManuscritosController {
  constructor(private readonly manuscritosService: ManuscritosService) {}

  // Este endpoint responderá si la ruta es "/" o "/manuscritos" o "/api/manuscritos"
  @Post(['/', 'manuscritos', 'api/manuscritos'])
  crear(@Body() datos: Partial<Manuscrito>) {
    console.log('--- ¡Petición Recibida con éxito! ---');
    return this.manuscritosService.crear(datos);
  }

  @Get(['/', 'manuscritos', 'api/manuscritos'])
  obtenerTodos() {
    return this.manuscritosService.obtenerTodos();
  }
}