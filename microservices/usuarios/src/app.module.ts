import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager'; 
import { redisStore } from 'cache-manager-redis-yet'; 
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';import { Usuario } from './entities/usuario.entity';
import { PerfilProfesional } from './entities/perfil-profesional.entity';
import { Rol } from './entities/rol.entity';
import { AjusteSistema } from './entities/ajuste-sistema.entity';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    // 0. Rate Limiting (10 peticiones por minuto por IP)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    // 1. Conexión de MariaDB
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.MARIADB_HOST || 'mariadb',
      port: process.env.MARIADB_PORT ? parseInt(process.env.MARIADB_PORT, 10) : 3306,
      username: process.env.MARIADB_USER || 'root',
      password: process.env.MARIADB_PASSWORD || 'root_password',
      database: process.env.MARIADB_DATABASE || 'mi_base_datos',
      entities: [Usuario, PerfilProfesional, Rol, AjusteSistema],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Usuario, PerfilProfesional, Rol, AjusteSistema]),

    // 2. Auth y Usuarios
    AuthModule,
    UsuariosModule,

    // 3. Conexión a Redis
    CacheModule.registerAsync({
      isGlobal: true, // Permite usar la caché en cualquier parte de este microservicio
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'redis',
            port: 6379,
          },
        }),
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}