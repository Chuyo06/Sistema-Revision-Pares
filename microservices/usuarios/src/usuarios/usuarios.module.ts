import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { PerfilProfesional } from '../entities/perfil-profesional.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, PerfilProfesional])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
