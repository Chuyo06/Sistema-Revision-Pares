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

  async generateText(prompt: string, modelName: string = 'gemini-2.5-flash'): Promise<string> {
    if (process.env.GEMINI_API_KEY === 'MOCK_KEY' || !process.env.GEMINI_API_KEY) {
      this.logger.warn('Using MOCK_KEY for Gemini. Returning mock response.');
      return this.getMockResponse(prompt);
    }

    const model = this.genAI.getGenerativeModel({ model: modelName });
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        this.logger.log(`[IA REAL] Gemini respondió correctamente (intento ${attempt}/${maxRetries}).`);
        return text;
      } catch (error: any) {
        const status = error?.status || error?.code;

        if ((status === 429 || status === 503) && attempt < maxRetries) {
          const waitSeconds = 10 * Math.pow(2, attempt - 1); // 10s, 20s, 40s
          this.logger.warn(
            `Gemini API rate limit (${status}). Reintentando en ${waitSeconds}s... (intento ${attempt}/${maxRetries})`,
          );
          await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
        } else {
          this.logger.error(
            `Gemini API error (${status}) después de ${attempt} intento(s). Usando respuesta MOCK como fallback.`,
          );
          return this.getMockResponse(prompt);
        }
      }
    }

    // Fallback final (no debería llegar aquí)
    return this.getMockResponse(prompt);
  }

  private getMockResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();

    // Basic heuristics to return a sensible mock JSON based on the prompt content
    if (prompt.includes('CONECTADO')) {
      return 'CONECTADO';
    }

    if (lowerPrompt.includes('evalúa esta revisión') || lowerPrompt.includes('calidad de la revisión')) {
      return JSON.stringify({
        score: 85,
        sugerencias: ["Considera ser más específico en la sección de metodología.", "Buen tono profesional."],
        constructividad: "Alta",
        tono: "Profesional"
      });
    }

    // ─── ANÁLISIS ÉTICO (comité de ética) ──────────────────────
    if (lowerPrompt.includes('comité de ética') || lowerPrompt.includes('problemas éticos')) {
      return this.getMockEthicsResponse(lowerPrompt);
    }

    // ─── DETECCIÓN DE PLAGIO ───────────────────────────────────
    if (lowerPrompt.includes('detección de similitud') || lowerPrompt.includes('originalidad')) {
      return this.getMockPlagiarismResponse(lowerPrompt);
    }

    if (lowerPrompt.includes('carta de decisión')) {
      return JSON.stringify({
        carta: "Estimado autor, hemos revisado su manuscrito y se ha decidido ACEPTAR CON REVISIONES MENORES. Por favor atienda los comentarios adjuntos.",
        timelineSugerido: "2 semanas"
      });
    }

    return JSON.stringify({ message: "Mock response generated" });
  }

  private getMockEthicsResponse(fullPrompt: string): string {
    // Extraer SOLO el contenido del manuscrito (después de "título:")
    // para que las instrucciones del sistema no contaminen el análisis
    const tituloIdx = fullPrompt.indexOf('título:');
    const manuscritoText = tituloIdx >= 0
      ? fullPrompt.substring(tituloIdx, fullPrompt.indexOf('devuelve estrictamente', tituloIdx) || undefined)
      : '';

    const alertas: string[] = [];
    let categoria = 'sin problemas';

    // Detectar heurísticamente temas sensibles SOLO en el manuscrito
    const mencionaHumanos = /paciente|participante|voluntario|encuesta|entrevista|ensayo clínico/i.test(manuscritoText);
    const mencionaAnimales = /animal|ratón|rata|primate|in vivo|modelo animal/i.test(manuscritoText);
    const mencionaDatosSensibles = /datos personales|información médica|historial clínico|expediente|privacidad|anonimización/i.test(manuscritoText);
    const mencionaMenores = /niño|menor de edad|adolescente|pediatr/i.test(manuscritoText);
    const mencionaConsentimiento = /consentimiento informado|aprobación del comité/i.test(manuscritoText);

    if (mencionaHumanos) {
      if (!mencionaConsentimiento) {
        alertas.push('El manuscrito menciona estudios con participantes humanos pero no hace referencia explícita al consentimiento informado ni a la aprobación de un comité de ética.');
        categoria = 'requiere revisión';
      } else {
        alertas.push('El manuscrito menciona estudios con humanos y hace referencia al consentimiento informado.');
        categoria = 'sin problemas';
      }
    }

    if (mencionaAnimales) {
      alertas.push('El manuscrito involucra experimentación animal. Se recomienda verificar la aprobación del comité de bioética correspondiente.');
      categoria = categoria === 'requiere revisión' ? 'requiere revisión' : 'advertencia';
    }

    if (mencionaDatosSensibles) {
      alertas.push('El manuscrito maneja datos sensibles o información médica. Verificar que se hayan aplicado protocolos de anonimización.');
      categoria = categoria === 'requiere revisión' ? 'requiere revisión' : 'advertencia';
    }

    if (mencionaMenores) {
      alertas.push('El manuscrito involucra población menor de edad. Se requiere verificación especial de consentimiento de tutores legales.');
      categoria = 'requiere revisión';
    }

    // Si no se detectaron temas sensibles, el artículo es limpio
    if (alertas.length === 0) {
      return JSON.stringify({
        alertas: [],
        categoria: 'sin problemas',
        justificacion: 'No se detectaron problemas éticos en el manuscrito. El contenido no involucra sujetos humanos, animales ni datos sensibles.'
      });
    }

    return JSON.stringify({
      alertas,
      categoria,
      justificacion: `Se detectaron ${alertas.length} observación(es) ética(s) basadas en el contenido del manuscrito.`
    });
  }

  /**
   * Genera una respuesta mock de plagio que varía según la longitud
   * y contenido del manuscrito.
   */
  private getMockPlagiarismResponse(text: string): string {
    // Simular un porcentaje bajo por defecto para manuscritos originales
    const esCorto = text.length < 500;
    const porcentaje = esCorto ? 12 : 8;
    const nivel = porcentaje > 30 ? 'Alto' : porcentaje > 15 ? 'Medio' : 'Bajo';

    return JSON.stringify({
      porcentajeSimilitud: porcentaje,
      nivelPlagio: nivel,
      seccionesSospechosas: esCorto
        ? [{ texto: 'Fragmento genérico de introducción', posibleFuente: 'Frase estándar académica común' }]
        : []
    });
  }
}
