import { Controller, Post, Get, Body } from '@nestjs/common';
import { ManuscritosService } from './manuscritos.service';
import { Manuscrito } from './entities/manuscrito.entity';

@Controller() // El Gateway ya nos pone el prefijo /api/manuscritos/
export class ManuscritosController {
  constructor(private readonly manuscritosService: ManuscritosService) {}

  @Post()
  crear(@Body() datos: Partial<Manuscrito>) {
    return this.manuscritosService.crear(datos);
  }

  @Get()
  obtenerTodos() {
    return this.manuscritosService.obtenerTodos();
  }
}