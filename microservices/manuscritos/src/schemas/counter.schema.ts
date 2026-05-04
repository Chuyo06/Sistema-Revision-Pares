import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Counter atómico para generar referencias secuenciales (RPP-YYYY-NNNN)
 * sin race condition entre uploads concurrentes y la creación del documento.
 *
 * Se usa con findOneAndUpdate({ _id }, { $inc: { seq: 1 } }, { upsert: true })
 * que es una operación atómica en MongoDB.
 */
export type CounterDocument = Counter & Document;

@Schema({ _id: false, versionKey: false })
export class Counter {
  @Prop({ type: String })
  _id: string; // p.ej. "manuscritos-2026"

  @Prop({ type: Number, default: 0 })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
