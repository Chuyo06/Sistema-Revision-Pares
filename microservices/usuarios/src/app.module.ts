import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager'; 
import { redisStore } from 'cache-manager-redis-yet'; 
import { Usuario } from './entities/usuario.entity';
import { PerfilProfesional } from './entities/perfil-profesional.entity';
import { Rol } from './entities/rol.entity';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    // 1. Conexión de MariaDB
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'mariadb',
      port: 3306,
      username: 'root',
      password: 'root_password',
      database: 'mi_base_datos',
      entities: [Usuario, PerfilProfesional, Rol],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Usuario, PerfilProfesional, Rol]),

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
  providers: [],
  exports: [],
})
export class AppModule {}