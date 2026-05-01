import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ManuscritoDocument = Manuscrito & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class Manuscrito {
  @Prop({ required: true })
  titulo!: string;

  @Prop({ required: true })
  contenido!: string;

  @Prop({ required: true })
  autorId!: number;

  @Prop()
  resumen?: string;

  @Prop()
  autores?: string;

  @Prop()
  convocatoria?: string;

  @Prop({ unique: true, sparse: true })
  referencia?: string;

  @Prop()
  fechaEnvio?: Date;

  @Prop({ default: 0 })
  revisoresAsignados!: number;

  @Prop({ default: 0 })
  revisionesCompletadas!: number;

  @Prop({ default: 'pendiente' })
  estado!: string;
}

export const ManuscritoSchema = SchemaFactory.createForClass(Manuscrito);
