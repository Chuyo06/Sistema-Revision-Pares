import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Manuscrito, ManuscritoSchema } from './schemas/manuscrito.schema';
import { ManuscritosService } from './manuscritos.service';
import { ManuscritosController } from './manuscritos.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:password@mongodb:27017/rpp_manuscritos?authSource=admin',
    ),
    MongooseModule.forFeature([
      { name: Manuscrito.name, schema: ManuscritoSchema },
    ]),
  ],
  controllers: [ManuscritosController],
  providers: [ManuscritosService],
})
export class AppModule {}
