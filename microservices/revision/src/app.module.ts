import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionRevision } from './entities/asignacion-revision.entity';
import { RevisionController } from './controllers/revision.controller';
import { RevisionService } from './services/revision.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'mariadb',
      port: 3306,
      username: 'root',
      password: 'root_password',
      database: 'mi_base_datos',
      entities: [AsignacionRevision],
      synchronize: false, 
    }),
    TypeOrmModule.forFeature([AsignacionRevision]),
  ],
  controllers: [RevisionController],
  providers: [RevisionService],
})
export class AppModule {}