import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('perfiles_profesionales')
export class PerfilProfesional {
  @PrimaryGeneratedColumn({ name: 'id_perfil' })
  id_perfil!: number;

  @Column({ type: 'varchar', length: 150, name: 'nombre_completo' })
  nombre_completo!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  institucion!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  orcid!: string;

  @Column({ type: 'varchar', length: 200, name: 'especialidad_academica', nullable: true })
  especialidad_academica!: string;

  @Column({ type: 'varchar', length: 255, name: 'palabras_clave', nullable: true })
  palabras_clave!: string;

  @Column({ type: 'text', name: 'experiencia', nullable: true })
  experiencia!: string;

  @Column({ type: 'longtext', nullable: true })
  avatar!: string;

  @OneToOne(() => Usuario, (usuario) => usuario.perfil, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' }) 
  usuario!: Usuario;
}