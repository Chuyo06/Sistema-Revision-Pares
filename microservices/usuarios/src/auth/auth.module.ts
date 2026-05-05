import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { PerfilProfesional } from '../entities/perfil-profesional.entity';
import { Rol } from '../entities/rol.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, PerfilProfesional, Rol]),
    JwtModule.register({
      secret: 'MI_SUPER_SECRETO_TEMPORAL', // En producción, esto se guarda en el archivo .env
      signOptions: { expiresIn: '2h' }, // El token dura 2 horas
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}