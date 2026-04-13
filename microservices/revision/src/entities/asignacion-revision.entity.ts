import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum EstadoRevision {
  PENDIENTE = 'PENDIENTE',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  COMPLETADA = 'COMPLETADA',
}

@Entity('asignaciones_revision')
export class AsignacionRevision {
  @PrimaryGeneratedColumn({ name: 'id_asignacion' })
  id_asignacion!: number;

  @Column({ type: 'int' })
  id_revisor!: number; // Se conecta lógicamente con el id_usuario del otro microservicio

  @Column({ type: 'varchar', length: 100 })
  id_manuscrito_mongo!: string; // El puente hacia MongoDB

  @Column({ type: 'enum', enum: EstadoRevision, default: EstadoRevision.PENDIENTE })
  estado!: EstadoRevision;

  @CreateDateColumn({ name: 'fecha_asignacion' })
  fecha_asignacion!: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_respuesta!: Date;
}