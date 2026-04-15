import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manuscrito } from './entities/manuscrito.entity';
import { ManuscritosService } from './manuscritos.service';
import { ManuscritosController } from './manuscritos.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'mariadb',
      port: 3306,
      username: 'root',
      password: 'root_password',
      database: 'mi_base_datos',
      entities: [Manuscrito],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Manuscrito]),
  ],
  controllers: [ManuscritosController], // <-- ¡Solo nuestro controlador!
  providers: [ManuscritosService],
})
export class AppModule {}