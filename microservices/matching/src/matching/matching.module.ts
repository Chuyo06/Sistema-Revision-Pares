import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { VectorStoreService } from './vector-store.service';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [MatchingController],
  providers: [MatchingService, VectorStoreService],
})
export class MatchingModule {}
