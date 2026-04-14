import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Manuscrito, ManuscritoSchema } from './schemas/manuscrito.schema'; // 👈 Nueva importación

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:password@mongodb:27017/mi_base_datos?authSource=admin'),
    
    // 2. Registramos nuestro esquema específico
    MongooseModule.forFeature([
      { name: Manuscrito.name, schema: ManuscritoSchema }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}