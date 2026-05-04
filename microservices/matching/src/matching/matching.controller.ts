import { Controller, Post, Body, Get } from '@nestjs/common';
import { MatchingService } from './matching.service';

@Controller()
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'matching', timestamp: new Date().toISOString() };
  }

  @Post('suggest')
  async suggestReviewers(@Body() body: { titulo: string; resumen: string; palabrasClave: string }) {
    return this.matchingService.suggestReviewers(body.titulo, body.resumen, body.palabrasClave);
  }

  @Post('check-conflicts')
  async checkConflicts(@Body() body: { autor: string; revisoresId: string[] }) {
    return this.matchingService.checkConflicts(body.autor, body.revisoresId);
  }
}
