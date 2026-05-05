import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ManuscritoDocument = Manuscrito & Document;

@Schema({ timestamps: { createdAt: 'fechaSubida', updatedAt: false } })
export class Manuscrito {
  @Prop({ required: true })
  titulo: string;

  @Prop()
  resumen: string;

  @Prop()
  contenido: string;

  @Prop({ required: true })
  autorId: number;

  @Prop()
  editorId: number;

  @Prop()
  autores: string;

  @Prop({ default: 'BORRADOR' })
  estado: string;

  @Prop()
  convocatoria: string;

  @Prop()
  referencia: string;

  @Prop()
  respuestasRevisores: string;

  @Prop({ default: 0 })
  revisoresAsignados: number;

  @Prop({ default: 0 })
  revisionesCompletadas: number;

  @Prop()
  fechaEnvio: Date;

  @Prop()
  editorSeccionId: number;

  @Prop()
  motivoRechazo: string;
}

export const ManuscritoSchema = SchemaFactory.createForClass(Manuscrito);