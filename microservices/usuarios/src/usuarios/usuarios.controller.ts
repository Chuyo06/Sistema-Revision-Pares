import { Controller, Get, Param, Patch, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios') // Nota: Mantenemos 'usuarios' para respetar el estándar de tu equipo
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  // ✅ 1. ESTO CUMPLE TU TAREA (GET genérico)
  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    const numericId = +id;
    if (isNaN(numericId)) {
      return null;
    }
    return this.usuariosService.obtenerPorId(numericId);
  }

  // ✅ 2. ESTO CUMPLE TU TAREA (PATCH genérico)
  @Patch(':id')
  async actualizarGeneral(@Param('id') id: string, @Body() body: any) {
    const numericId = +id;
    
    // Reutilizamos los métodos que ya existen en tu servicio
    if (body.estado) {
      await this.usuariosService.actualizarEstado(numericId, body.estado);
    }
    if (body.rol || body.roles) {
      await this.usuariosService.actualizarRol(numericId, body.rol || body.roles);
    }
    
    return this.usuariosService.obtenerPorId(numericId);
  }

  // --- Mantenemos los endpoints específicos por si tus compañeros los usan ---

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