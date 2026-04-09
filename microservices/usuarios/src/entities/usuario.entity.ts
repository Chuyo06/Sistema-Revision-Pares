import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Rol } from './rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  nombre!: string;

  @ManyToMany(() => Rol)
  @JoinTable({
    name: 'usuarios_roles',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'rol_id', referencedColumnName: 'id' },
  })
  roles!: Rol[];
}