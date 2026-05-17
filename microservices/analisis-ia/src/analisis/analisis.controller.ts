import { Controller, Post, Body, Get } from '@nestjs/common';
import { AnalisisService } from './analisis.service';

@Controller()
export class AnalisisController {
  constructor(private readonly analisisService: AnalisisService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'analisis-ia', timestamp: new Date().toISOString() };
  }

  @Get('test-connection')
  async testConnection() {
    return this.analisisService.testConnection();
  }

  @Post('evaluate-review')
  async evaluateReview(@Body() body: { comentarios: string }) {
    return this.analisisService.evaluateReview(body.comentarios);
  }

  @Post('ethics-check')
  async ethicsCheck(@Body() body: { titulo: string; resumen: string; contenido: string }) {
    return this.analisisService.ethicsCheck(body.titulo, body.resumen, body.contenido);
  }

  @Post('draft-decision')
  async draftDecision(@Body() body: { decisionEditor: string; revisiones: string[] }) {
    return this.analisisService.draftDecision(body.decisionEditor, body.revisiones);
  }

  @Post('check-plagiarism')
  async checkPlagiarism(@Body() body: { titulo: string; resumen: string; contenido: string }) {
    return this.analisisService.checkPlagiarism(body.titulo, body.resumen, body.contenido);
  }
}
