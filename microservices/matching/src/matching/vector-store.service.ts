import { Injectable, Logger } from '@nestjs/common';

export interface VectorDocument {
  id: string;
  text: string;
  metadata: any;
  embedding?: number[];
}

@Injectable()
export class VectorStoreService {
  private readonly logger = new Logger(VectorStoreService.name);
  private documents: VectorDocument[] = [];

  // Cosine similarity function
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  addDocuments(docs: VectorDocument[]) {
    this.documents.push(...docs);
    this.logger.log(`Added ${docs.length} documents to in-memory vector store.`);
  }

  clear() {
    this.documents = [];
    this.logger.log('Vector store cleared.');
  }

  getDocumentCount(): number {
    return this.documents.length;
  }

  // Find top K most similar documents
  search(queryEmbedding: number[], topK: number = 5): Array<{ doc: VectorDocument; score: number }> {
    const results = this.documents
      .filter(doc => doc.embedding)
      .map(doc => {
        const score = this.cosineSimilarity(queryEmbedding, doc.embedding!);
        return { doc, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
      
    return results;
  }
}
