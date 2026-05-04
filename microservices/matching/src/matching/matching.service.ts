import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { VectorStoreService, VectorDocument } from './vector-store.service';

@Injectable()
export class MatchingService implements OnModuleInit {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly vectorStore: VectorStoreService,
  ) {}

  async onModuleInit() {
    // In a real application, we would load reviewers from DB here.
    // For MVP, we'll mock some reviewers.
    await this.seedMockReviewers();
  }

  private async seedMockReviewers() {
    this.logger.log('Seeding mock reviewers for Vector Search...');
    const mockReviewers = [
      { id: 'rev-1', nombre: 'Dra. Elena Gómez', especialidad: 'Machine Learning, Redes Neuronales, Inteligencia Artificial' },
      { id: 'rev-2', nombre: 'Dr. Carlos Ruiz', especialidad: 'Computación Cuántica, Física Teórica' },
      { id: 'rev-3', nombre: 'Dra. Maria Salgado', especialidad: 'Bioinformática, Análisis de Datos Biológicos' },
      { id: 'rev-4', nombre: 'Dr. Juan Pérez', especialidad: 'Ciberseguridad, Criptografía, Redes' },
    ];

    const docs: VectorDocument[] = [];
    for (const rev of mockReviewers) {
      const textToEmbed = `Nombre: ${rev.nombre}. Especialidad y publicaciones: ${rev.especialidad}`;
      const embedding = await this.geminiService.generateEmbedding(textToEmbed);
      docs.push({
        id: rev.id,
        text: textToEmbed,
        metadata: rev,
        embedding,
      });
    }

    this.vectorStore.addDocuments(docs);
  }

  async suggestReviewers(titulo: string, resumen: string, palabrasClave: string): Promise<any> {
    try {
      // 1. Generate embedding for the manuscript
      const textToEmbed = `Título: ${titulo}. Resumen: ${resumen}. Palabras clave: ${palabrasClave}`;
      const queryEmbedding = await this.geminiService.generateEmbedding(textToEmbed);

      // 2. Vector search to find top candidates
      const searchResults = this.vectorStore.search(queryEmbedding, 3);
      
      // 3. Ask LLM to justify the top candidates
      const prompt = `
        Eres un sistema de asignación de revisores.
        Tenemos un manuscrito con:
        Título: ${titulo}
        Resumen: ${resumen}

        Hemos encontrado estos candidatos mediante búsqueda vectorial:
        ${searchResults.map(r => `- ${r.doc.metadata.nombre} (${r.doc.metadata.especialidad}) [Similitud: ${r.score.toFixed(2)}]`).join('\n')}

        Devuelve un objeto JSON estricto con un arreglo llamado "sugerencias".
        Cada sugerencia debe tener:
        - revisor: nombre del revisor.
        - id: el id del revisor (${searchResults.map(r => r.doc.id).join(', ')}).
        - afinidad: porcentaje estimado del 0 al 100.
        - justificacion: una frase explicando por qué es un buen match.
        
        No incluyas formato Markdown en la respuesta, solo el JSON puro.
      `;

      const responseText = await this.geminiService.generateText(prompt);
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      this.logger.error('Error in suggestReviewers:', error);
      throw error;
    }
  }

  async checkConflicts(autor: string, revisoresId: string[]): Promise<any> {
    const prompt = `
      Analiza posibles conflictos de interés.
      Autor del artículo: ${autor}
      Revisores propuestos: ${revisoresId.join(', ')}

      Verifica si hay posibles conflictos por institución o colaboración reciente.
      Devuelve un objeto JSON estricto con:
      - alertas: arreglo de objetos { revisorId, riesgo ("Alto", "Medio", "Bajo"), justificacion }
      - hayConflicto: boolean indicando si encontraste al menos un riesgo Alto.
      
      No incluyas formato Markdown en la respuesta, solo el JSON puro.
    `;

    try {
      const responseText = await this.geminiService.generateText(prompt);
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      this.logger.error('Error checking conflicts:', e);
      throw e;
    }
  }
}
