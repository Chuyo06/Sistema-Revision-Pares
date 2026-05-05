import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConvocatoriaDocument = Convocatoria & Document;

@Schema({ timestamps: true })
export class Convocatoria {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  fechaInicio: string;

  @Prop({ required: true })
  fechaLimite: string;

  @Prop({ type: [String], default: [] })
  areasTematicas: string[];
}

export const ConvocatoriaSchema = SchemaFactory.createForClass(Convocatoria);
