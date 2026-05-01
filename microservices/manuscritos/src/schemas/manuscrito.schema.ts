
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Esto une nuestra clase con las funciones de documento de MongoDB
export type ManuscritoDocument = Manuscrito & Document;

@Schema({ timestamps: true })
export class Manuscrito {
  @Prop({ required: true })
  titulo!: string;

  @Prop({ required: true })
  contenido!: string;

  @Prop({ required: true })
  autorId!: number;

  @Prop({ default: 'pendiente' })
  estado!: string;
}

export const ManuscritoSchema = SchemaFactory.createForClass(Manuscrito);