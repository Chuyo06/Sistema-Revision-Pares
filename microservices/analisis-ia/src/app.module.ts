import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiModule } from './gemini/gemini.module';
import { AnalisisModule } from './analisis/analisis.module';

@Module({
  imports: [GeminiModule, AnalisisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
