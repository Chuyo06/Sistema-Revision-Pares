import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core'; // <-- Importación necesaria
import { ManuscritosController } from './manuscritos.controller';
import { ManuscritosService } from './manuscritos.service';
import { Manuscrito, ManuscritoSchema } from './schemas/manuscrito.schema';
// Esta es la ruta real según tu estructura de carpetas
import { RolesGuard } from './common/decorators/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:password@mongodb:27017/manuscritos_db?authSource=admin'),
    MongooseModule.forFeature([{ name: Manuscrito.name, schema: ManuscritoSchema }]),
  ],
  controllers: [ManuscritosController],
  providers: [
    ManuscritosService,
    {
      provide: APP_GUARD, // Esto le dice a NestJS: "Usa este guardián en todas partes"
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}