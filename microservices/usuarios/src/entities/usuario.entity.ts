import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { PerfilProfesional } from './perfil-profesional.entity';
import { Rol } from './rol.entity';

export enum RolUsuario {
  AUTOR = 'AUTOR',
  REVISOR = 'REVISOR',
  EDITOR = 'EDITOR',
  EDITOR_JEFE = 'EDITOR_JEFE',
  EDITOR_SECCION = 'EDITOR_SECCION',
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

  @ManyToMany(() => Rol)
  @JoinTable({
    name: 'usuario_roles',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id_usuario' },
    inverseJoinColumn: { name: 'rol_id', referencedColumnName: 'id' }
  })
  roles!: Rol[];

  @Column({ type: 'enum', enum: EstadoUsuario, default: EstadoUsuario.ACTIVO })
  estado!: EstadoUsuario;

  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro!: Date;

  // Relación 1 a 1 con el perfil
  @OneToOne(() => PerfilProfesional, (perfil) => perfil.usuario)
  perfil!: PerfilProfesional;
}