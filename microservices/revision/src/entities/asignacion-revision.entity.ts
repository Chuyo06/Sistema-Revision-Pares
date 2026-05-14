import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('asignaciones_revision')
export class AsignacionRevision {
  @PrimaryGeneratedColumn({ name: 'id_asignacion' })
  id_asignacion: number;

  @Column({ type: 'int' })
  id_revisor: number;

  @Column({ name: 'id_manuscrito_mongo', length: 100 })
  id_manuscrito_mongo: string;

  @Column({ type: 'enum', enum: ['INVITADO', 'ACEPTADO', 'DECLINADO', 'COMPLETADA', 'EXPIRADA'], default: 'INVITADO' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_invitacion' })
  fecha_invitacion: Date;

  @Column({ type: 'date', name: 'fecha_limite' })
  fecha_limite: Date;

  @Column({ type: 'int', nullable: true })
  originalidad: number;

  @Column({ type: 'int', nullable: true })
  metodologia: number;

  @Column({ type: 'int', nullable: true })
  claridad: number;

  @Column({ type: 'int', nullable: true })
  relevancia: number;

  @Column({ type: 'int', nullable: true })
  puntuacion: number;

  @Column({ type: 'int', default: 1 })
  ronda: number;

  @Column({ type: 'text', nullable: true })
  comentarios: string;

  @Column({ type: 'text', nullable: true })
  comentarios_editor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  recomendacion: string;

  @Column({ type: 'timestamp', name: 'fecha_completada', nullable: true })
  fecha_completada: Date | null;

  @Column({ type: 'varchar', length: 200, name: 'especialidad_revisor', nullable: true })
  especialidad_revisor: string;
}
