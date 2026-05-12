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
    // Seeding movido a carga perezosa (lazy-loading) para optimizar el tiempo de arranque
  }

  private async loadRealReviewers() {
    this.logger.log('Loading real reviewers from Usuarios microservice...');
    try {
      const urlUsuarios = process.env.MS_USUARIOS_URL || 'http://usuarios:3000';
      const res = await fetch(`${urlUsuarios}/`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const usuarios = await res.json();
      
      const revisores = usuarios.filter((u: any) => u.roles && u.roles.includes('revisor'));
      if (revisores.length === 0) {
        this.logger.warn('No real reviewers found, using fallback mocks');
        return this.seedMockReviewers();
      }

      const docs: VectorDocument[] = [];
      for (const rev of revisores) {
        const especialidades = rev.especialidad ? rev.especialidad : 'General';
        const textToEmbed = `Nombre: ${rev.nombre}. Especialidad y publicaciones: ${especialidades}`;
        const embedding = await this.geminiService.generateEmbedding(textToEmbed);
        docs.push({
          id: rev.id.toString(),
          text: textToEmbed,
          metadata: rev,
          embedding,
        });
      }
      this.vectorStore.clear();
      this.vectorStore.addDocuments(docs);
    } catch (error) {
      this.logger.error('Error loading real reviewers, falling back to mocks', error);
      await this.seedMockReviewers();
    }
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
      // Lazy load reviewers si el store está vacío
      if (this.vectorStore.getDocumentCount() === 0) {
        await this.loadRealReviewers();
      }

      // 1. Generate embedding for the manuscript
      const textToEmbed = `Título: ${titulo}. Resumen: ${resumen}. Palabras clave: ${palabrasClave}`;
      const queryEmbedding = await this.geminiService.generateEmbedding(textToEmbed);

      // 2. Vector search to find top candidates
      const searchResults = this.vectorStore.search(queryEmbedding, 3);

      // Si no hay GEMINI_API_KEY real, los embeddings y el LLM están en modo mock
      // y el JSON que devolvería el LLM no incluiría `sugerencias`. Usamos la
      // heurística por keyword overlap para ofrecer una respuesta válida y útil
      // sin depender de Gemini.
      const sinClaveReal = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MOCK_KEY';
      if (sinClaveReal) {
        return this.buildHeuristicSuggestions(searchResults, titulo, resumen, palabrasClave);
      }

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

      try {
        const responseText = await this.geminiService.generateText(prompt);
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed && Array.isArray(parsed.sugerencias) && parsed.sugerencias.length > 0) {
          return parsed;
        }
        // El LLM devolvió algo, pero sin `sugerencias` válidas → fallback heurístico.
        this.logger.warn('Respuesta del LLM sin "sugerencias" — usando heurística.');
        return this.buildHeuristicSuggestions(searchResults, titulo, resumen, palabrasClave);
      } catch (llmErr) {
        // El LLM falló (red, parseo, etc.) → no rompemos el endpoint.
        this.logger.warn(`Fallo al llamar al LLM, usando heurística: ${llmErr.message}`);
        return this.buildHeuristicSuggestions(searchResults, titulo, resumen, palabrasClave);
      }
    } catch (error) {
      this.logger.error('Error in suggestReviewers:', error);
      // Último recurso: respuesta válida vacía para no romper el frontend.
      return { sugerencias: [] };
    }
  }

  /**
   * Heurística de respaldo: clasifica candidatos por solapamiento de palabras
   * entre la especialidad del revisor y los textos del manuscrito.
   * Devuelve la misma forma { sugerencias: [...] } que produce el LLM.
   */
  private buildHeuristicSuggestions(
    searchResults: Array<{ doc: VectorDocument; score: number }>,
    titulo: string,
    resumen: string,
    palabrasClave: string,
  ) {
    const tokenize = (s: string) =>
      String(s || '')
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter((t) => t.length >= 3);

    const tokensManuscrito = new Set([
      ...tokenize(titulo),
      ...tokenize(resumen),
      ...tokenize(palabrasClave),
    ]);

    const sugerencias = searchResults.map((r) => {
      const meta = r.doc.metadata || {};
      const tokensRevisor = new Set(tokenize(meta.especialidad || ''));
      let coincidencias = 0;
      for (const t of tokensRevisor) {
        if (tokensManuscrito.has(t)) coincidencias++;
      }

      // Mezcla similitud coseno (0-50pt) + solapamiento (0-50pt). Min 50, max 98.
      const baseScore = Math.max(0, r.score || 0) * 50;
      const overlapScore = Math.min(50, coincidencias * 10);
      const afinidad = Math.max(50, Math.min(98, Math.round(baseScore + overlapScore + 30)));

      const justificacion = coincidencias > 0
        ? `Su especialidad (${meta.especialidad || 'área relacionada'}) coincide con ${coincidencias} término(s) clave del manuscrito.`
        : `Perfil académico relevante para el área general del manuscrito.`;

      return {
        revisor: meta.nombre,
        id: r.doc.id,
        afinidad,
        justificacion,
      };
    });

    // Ordenar por afinidad descendente para un orden estable.
    sugerencias.sort((a, b) => b.afinidad - a.afinidad);
    return { sugerencias };
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
