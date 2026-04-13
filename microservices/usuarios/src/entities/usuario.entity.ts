import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { PerfilProfesional } from './perfil-profesional.entity';

export enum RolUsuario {
  AUTOR = 'AUTOR',
  REVISOR = 'REVISOR',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
}

@Entity('usuarios') 
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario!: number; 

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string; 

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  password_hash!: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.AUTOR })
  rol!: RolUsuario;

  @Column({ type: 'enum', enum: EstadoUsuario, default: EstadoUsuario.ACTIVO })
  estado!: EstadoUsuario;

  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro!: Date;

  // Relación 1 a 1 con el perfil
  @OneToOne(() => PerfilProfesional, (perfil) => perfil.usuario)
  perfil!: PerfilProfesional;
}