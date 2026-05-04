import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(GeminiService.name);

  constructor() {
    // In a real scenario, this comes from ConfigService. 
    // Using a placeholder or environment variable for MVP.
    const apiKey = process.env.GEMINI_API_KEY || 'MOCK_KEY';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string, modelName: string = 'gemini-1.5-flash'): Promise<string> {
    try {
      if (process.env.GEMINI_API_KEY === 'MOCK_KEY' || !process.env.GEMINI_API_KEY) {
        this.logger.warn('Using MOCK_KEY for Gemini. Returning mock response.');
        return this.getMockResponse(prompt);
      }
      const model = this.genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Error generating text with Gemini:', error);
      throw error;
    }
  }

  private getMockResponse(prompt: string): string {
    // Basic heuristics to return a sensible mock JSON based on the prompt content
    if (prompt.includes('CONECTADO')) {
      return 'CONECTADO';
    }
    if (prompt.includes('score') && prompt.includes('evalúa esta revisión')) {
      return JSON.stringify({
        score: 85,
        sugerencias: ["Considera ser más específico en la sección de metodología.", "Buen tono profesional."],
        constructividad: "Alta",
        tono: "Profesional"
      });
    }
    
    if (prompt.includes('ética') || prompt.includes('plagio')) {
      return JSON.stringify({
        alertas: ["Posible falta de declaración de consentimiento informado."],
        nivelRiesgo: "Medio",
        justificacion: "El texto menciona estudios con humanos pero no especifica el comité de ética."
      });
    }

    if (prompt.includes('carta de decisión')) {
      return JSON.stringify({
        carta: "Estimado autor, hemos revisado su manuscrito y se ha decidido ACEPTAR CON REVISIONES MENORES. Por favor atienda los comentarios adjuntos.",
        timelineSugerido: "2 semanas"
      });
    }

    return JSON.stringify({ message: "Mock response generated" });
  }
}
