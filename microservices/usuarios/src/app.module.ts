import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager'; 
import { redisStore } from 'cache-manager-redis-yet'; 
import { Usuario } from './entities/usuario.entity'; 
import { PerfilProfesional } from './entities/perfil-profesional.entity';

@Module({
  imports: [
    // 1. Conexión de MariaDB
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root_password',
      database: 'mi_base_datos',
      entities: [Usuario, PerfilProfesional],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Usuario, PerfilProfesional]),

    // 2. Conexión a Redis
    CacheModule.registerAsync({
      isGlobal: true, // Permite usar la caché en cualquier parte de este microservicio
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379, // El puerto por defecto donde levantamos Redis en tu Docker
          },
        }),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}