import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  destinatarioId: number;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ type: 'varchar', length: 100 })
  tipo: string;

  @Column({ type: 'boolean', default: false })
  leida: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;
}
