import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManuscritosService } from './manuscritos.service';
import { ManuscritosController } from './manuscritos.controller';
import { Manuscrito, ManuscritoSchema } from './schemas/manuscrito.schema';
import { Counter, CounterSchema } from './schemas/counter.schema';
import { Convocatoria, ConvocatoriaSchema } from './schemas/convocatoria.schema';
import { ConvocatoriasController } from './convocatorias/convocatorias.controller';
import { ConvocatoriasService } from './convocatorias/convocatorias.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://admin:password@mongodb:27017/manuscritos?authSource=admin'),
    MongooseModule.forFeature([
      { name: Manuscrito.name, schema: ManuscritoSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Convocatoria.name, schema: ConvocatoriaSchema },
    ]),
  ],
  controllers: [ConvocatoriasController, ManuscritosController],
  providers: [ManuscritosService, ConvocatoriasService],
})
export class AppModule {}