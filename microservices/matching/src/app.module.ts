import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Manuscrito, ManuscritoSchema } from './schemas/manuscrito.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchingModule } from './matching/matching.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://admin:password@mongodb:27017/manuscritos?authSource=admin'),
    
    // Registramos nuestro esquema específico
    MongooseModule.forFeature([
      { name: Manuscrito.name, schema: ManuscritoSchema }
    ]),
    MatchingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}