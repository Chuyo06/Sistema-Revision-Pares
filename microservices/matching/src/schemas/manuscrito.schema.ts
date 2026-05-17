import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Tipo de ayuda para TypeScript
export type ManuscritoDocument = Manuscrito & Document;

// 1. Sub-esquema para el análisis de IA
@Schema({ _id: false }) // _id: false porque es solo un fragmento interno, no un documento separado
export class AnalisisIA {
  @Prop({ required: true })
  score_plagio!: number;

  @Prop({ required: true })
  etica_aprobada!: boolean;

  @Prop([String])
  sugerencias!: string[];
}

// 2. Sub-esquema para el historial de versiones
@Schema({ _id: false })
export class Version {
  @Prop({ required: true })
  version!: number;

  @Prop({ required: true })
  fecha!: Date;

  @Prop({ required: true })
  archivo_url!: string;
}

// 3. El Esquema Principal
@Schema({ collection: 'manuscritos', timestamps: true })
export class Manuscrito {
  @Prop({ required: false })
  numero_referencia: string;

  @Prop({ required: true })
  titulo!: string;

  @Prop([String]) 
  autores!: string[];

  @Prop({ required: true })
  resumen!: string;

  @Prop([String])
  palabras_clave!: string[];

  @Prop()
  archivo_minio_url!: string;

  @Prop({ default: 'EN_ESPERA' })
  estado_revision!: string;

  // Anidamos los sub-esquemas que creamos arriba
  @Prop({ type: AnalisisIA })
  analisis_ia!: AnalisisIA;

  @Prop({ type: [Version] })
  historial_versiones!: Version[];
}

// Exportamos el modelo compilado listo para usar en los servicios
export const ManuscritoSchema = SchemaFactory.createForClass(Manuscrito);