import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'mi_mariadb', // El nombre de tu base de datos en docker-compose
      port: 3306,
      username: 'root',
      password: 'root', // Cambia esto si usaste otra contraseña en docker-compose
      database: 'sistema_revision',
      entities: [Usuario, Rol],
      synchronize: true, // ¡Esto hace que las tablas se creen solas!
    }),
    TypeOrmModule.forFeature([Usuario, Rol]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}