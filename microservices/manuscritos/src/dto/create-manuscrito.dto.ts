export class CreateManuscritoDto {
  titulo!: string;
  contenido!: string;
  autorId!: number;
  resumen?: string;
  autores?: string;
  convocatoria?: string;
  referencia?: string;
  estado?: string;
  fechaEnvio?: Date;
}
