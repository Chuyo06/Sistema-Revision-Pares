import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('manuscritos') // Nombre de la tabla
export class Manuscrito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column()
  autorId: number; // Por ahora guardamos el ID del usuario del otro microservicio

  @Column({ default: 'pendiente' })
  estado: string; // Ejemplo: pendiente, aprobado, rechazado

  @CreateDateColumn()
  fechaSubida: Date;
}