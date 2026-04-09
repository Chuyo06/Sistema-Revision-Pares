import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'mariadb',        // Nombre del servicio en docker-compose
      port: 3306,
      username: 'root',
      password: 'root_password', // La que dice tu archivo
      database: 'mi_base_datos',  // La que dice tu archivo
      entities: [Usuario, Rol],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Usuario, Rol]),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}