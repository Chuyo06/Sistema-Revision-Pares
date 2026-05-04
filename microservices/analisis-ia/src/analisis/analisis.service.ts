import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class AnalisisService {
  private readonly logger = new Logger(AnalisisService.name);

  constructor(private readonly geminiService: GeminiService) {}

  async testConnection(): Promise<any> {
    try {
      const response = await this.geminiService.generateText('Responde exactamente la palabra: CONECTADO');
      const exito = response.toUpperCase().includes('CONECTADO');
      return { ok: exito, message: exito ? 'Conexión a IA exitosa' : 'Respuesta inesperada de la IA' };
    } catch (e) {
      this.logger.error('Error in testConnection:', e);
      return { ok: false, message: e.message || 'Error de conexión' };
    }
  }

  async evaluateReview(comentarios: string): Promise<any> {
    const prompt = `
      Eres un asistente experto para editores de revistas científicas.
      Evalúa esta revisión realizada por un par evaluador.
      
      Revisión:
      "${comentarios}"

      Devuelve estrictamente un objeto JSON con las siguientes propiedades:
      - score: un número del 0 al 100 que indique la calidad de la revisión (basado en constructividad, especificidad y justificación).
      - sugerencias: un arreglo de strings con sugerencias para mejorar la revisión.
      - constructividad: "Alta", "Media" o "Baja".
      - tono: una breve descripción del tono profesional (ej. "Constructivo", "Agresivo", "Neutro").
      
      No incluyas formato Markdown en la respuesta, solo el JSON puro.
    `;
    
    try {
      const responseText = await this.geminiService.generateText(prompt);
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      this.logger.error('Error evaluating review:', e);
      throw e;
    }
  }

  async ethicsCheck(titulo: string, resumen: string, contenido: string): Promise<any> {
    const prompt = `
      Eres un comité de ética automatizado.
      Analiza el siguiente manuscrito en busca de posibles problemas éticos o alertas de plagio conceptual.
      
      Título: ${titulo}
      Resumen: ${resumen}
      Fragmento de contenido: ${contenido.substring(0, 3000)}

      Devuelve estrictamente un objeto JSON con las siguientes propiedades:
      - alertas: un arreglo de strings con posibles problemas (ej. falta de consentimiento informado, problemas con datos).
      - nivelRiesgo: "Alto", "Medio", o "Bajo".
      - justificacion: una explicación breve de la evaluación.
      
      No incluyas formato Markdown en la respuesta, solo el JSON puro.
    `;

    try {
      const responseText = await this.geminiService.generateText(prompt);
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      this.logger.error('Error checking ethics:', e);
      throw e;
    }
  }

  async draftDecision(decisionEditor: string, revisiones: string[]): Promise<any> {
    const revisionesText = revisiones.map((r, i) => `Revisor ${i+1}: ${r}`).join('\n\n');
    const prompt = `
      Eres un editor jefe de una revista científica académica.
      Debes redactar una carta de decisión para los autores.
      
      La decisión final del editor es: ${decisionEditor}
      
      Los comentarios de los revisores son:
      ${revisionesText}

      Sintetiza los puntos principales de los revisores en un resumen coherente para los autores y sugiere un tiempo para los cambios.
      
      Devuelve estrictamente un objeto JSON con:
      - carta: string con el texto formal de la carta dirigida a los autores.
      - timelineSugerido: string (ej. "2 semanas", "1 mes").

      No incluyas formato Markdown en la respuesta, solo el JSON puro.
    `;

    try {
      const responseText = await this.geminiService.generateText(prompt);
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      this.logger.error('Error drafting decision:', e);
      throw e;
    }
  }
}
