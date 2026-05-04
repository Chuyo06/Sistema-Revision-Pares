import { Module } from '@nestjs/common';
import { AnalisisController } from './analisis.controller';
import { AnalisisService } from './analisis.service';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [AnalisisController],
  providers: [AnalisisService],
})
export class AnalisisModule {}
