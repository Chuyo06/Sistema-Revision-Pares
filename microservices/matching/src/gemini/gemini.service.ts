import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(GeminiService.name);

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || 'MOCK_KEY';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string, modelName: string = 'gemini-2.5-flash'): Promise<string> {
    try {
      if (process.env.GEMINI_API_KEY === 'MOCK_KEY' || !process.env.GEMINI_API_KEY) {
        this.logger.warn('Using MOCK_KEY for Gemini Text. Returning mock response.');
        return this.getMockTextResponse(prompt);
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

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (process.env.GEMINI_API_KEY === 'MOCK_KEY' || !process.env.GEMINI_API_KEY) {
        this.logger.warn('Using MOCK_KEY for Gemini Embedding. Returning mock vector.');
        return this.getMockEmbedding(text);
      }
      const model = this.genAI.getGenerativeModel({ model: "gemini-embedding-2" });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      this.logger.error('Error generating embedding with Gemini:', error);
      throw error;
    }
  }

  private getMockTextResponse(prompt: string): string {
    if (prompt.includes('conflicto de interés')) {
      return JSON.stringify({
        hayConflicto: false,
        razon: "No se encontró coincidencia de institución ni coautorías recientes."
      });
    }
    
    if (prompt.includes('justifica la asignación')) {
      return JSON.stringify({
        justificacion: "El revisor tiene publicaciones previas que coinciden con las palabras clave del manuscrito."
      });
    }

    return JSON.stringify({ message: "Mock matching text" });
  }

  private getMockEmbedding(text: string): number[] {
    // Return a random vector of size 768 to simulate an embedding
    const vec = new Array(768).fill(0).map(() => Math.random() - 0.5);
    // Normalize it
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
    return vec.map(v => v / norm);
  }
}
