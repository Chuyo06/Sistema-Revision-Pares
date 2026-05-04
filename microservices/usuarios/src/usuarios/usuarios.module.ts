import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { PerfilProfesional } from '../entities/perfil-profesional.entity';
import { Rol } from '../entities/rol.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { AjusteSistema } from '../entities/ajuste-sistema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, PerfilProfesional, Rol, AjusteSistema])],
  controllers: [UsuariosController, ConfigController],
  providers: [UsuariosService, ConfigService],
})
export class UsuariosModule {}
