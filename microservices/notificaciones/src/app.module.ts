import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { NotificacionesController } from './controllers/notificaciones.controller';
import { NotificacionesService } from './services/notificaciones.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'mariadb',
      port: 3306,
      username: 'root',
      password: 'root_password',
      database: 'mi_base_datos',
      entities: [Notificacion],
      synchronize: true, // true to automatically create table in dev for this new entity
    }),
    TypeOrmModule.forFeature([Notificacion]),
  ],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
})
export class AppModule {}
