import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionRevision } from './entities/asignacion-revision.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root_password',
      database: 'mi_base_datos',
      entities: [AsignacionRevision],
      synchronize: false, 
    }),
    TypeOrmModule.forFeature([AsignacionRevision]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}