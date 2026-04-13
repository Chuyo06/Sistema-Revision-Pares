import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManuscritosController } from './manuscritos.controller';
import { ManuscritosService } from './manuscritos.service';
import { Manuscrito, ManuscritoSchema } from './schemas/manuscrito.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:password@mongodb:27017/manuscritos_db?authSource=admin'),
    MongooseModule.forFeature([{ name: Manuscrito.name, schema: ManuscritoSchema }]),
  ],
  controllers: [ManuscritosController],
  providers: [ManuscritosService],
})
export class AppModule {}