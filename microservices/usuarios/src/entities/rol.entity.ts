import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id!: number; // <-- Nota el signo de exclamación aquí

  @Column({ unique: true })
  nombre!: string; // <-- Y aquí también
}