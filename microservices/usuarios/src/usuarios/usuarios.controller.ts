import { Controller, Get, Param, Patch, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'usuarios', timestamp: new Date().toISOString() };
  }

  @Get()
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    const numericId = +id;
    if (isNaN(numericId)) {
      return null;
    }
    return this.usuariosService.obtenerPorId(numericId);
  }

  @Patch(':id')
  actualizarUsuario(
    @Param('id') id: string,
    @Body() body: { nombre?: string; email?: string; institucion?: string; especialidad?: string; palabras_clave?: string; experiencia?: string; estado?: string; roles?: string[]; rol?: string }
  ) {
    const numericId = +id;
    if (isNaN(numericId)) {
      return null;
    }
    return this.usuariosService.actualizarUsuario(numericId, body);
  }

  @Patch(':id/estado')
  actualizarEstado(@Param('id') id: string, @Body() body: { estado: string }) {
    return this.usuariosService.actualizarEstado(+id, body.estado);
  }

  @Patch(':id/rol')
  actualizarRol(@Param('id') id: string, @Body() body: { rol: string }) {
    return this.usuariosService.actualizarRol(+id, body.rol);
  }

  @Post()
  crearUsuario(@Body() body: { email: string; password: string; nombre: string; rol?: string }) {
    return this.usuariosService.crearUsuario(body);
  }

}
