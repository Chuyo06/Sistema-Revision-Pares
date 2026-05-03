import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('manuscritos')
export class Manuscrito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  resumen: string;

  @Column({ type: 'text', nullable: true })
  contenido: string;

  @Column()
  autorId: number;

  @Column({ type: 'int', nullable: true })
  editorId: number;

  @Column({ nullable: true })
  autores: string;

  @Column({ default: 'BORRADOR' })
  estado: string;

  @Column({ nullable: true })
  convocatoria: string;

  @Column({ nullable: true })
  referencia: string;

  @Column({ type: 'text', nullable: true })
  respuestasRevisores: string;

  @Column({ type: 'int', default: 0 })
  revisoresAsignados: number;

  @Column({ type: 'int', default: 0 })
  revisionesCompletadas: number;

  @Column({ type: 'date', nullable: true })
  fechaEnvio: Date;

  @Column({ type: 'text', nullable: true })
  motivoRechazo: string;

  @Column({ type: 'timestamp', nullable: true })
  fechaDecision: Date;

  @CreateDateColumn()
  fechaSubida: Date;
}
