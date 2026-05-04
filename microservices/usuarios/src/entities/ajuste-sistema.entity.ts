import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ajustes_sistema')
export class AjusteSistema {
  @PrimaryColumn()
  clave: string;

  @Column({ type: 'text' })
  valor: string; // Se guardará como string (JSON.stringify)
}
