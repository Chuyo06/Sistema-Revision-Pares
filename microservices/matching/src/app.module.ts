import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Manuscrito, ManuscritoSchema } from './schemas/manuscrito.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:password@mongodb:27017/mi_base_datos?authSource=admin'),
    
    // Registramos nuestro esquema específico
    MongooseModule.forFeature([
      { name: Manuscrito.name, schema: ManuscritoSchema }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}