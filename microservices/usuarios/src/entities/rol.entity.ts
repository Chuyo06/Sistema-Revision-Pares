import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Usuario } from './usuario.entity'; // Asegúrate de que esta ruta apunte a tu archivo de usuario

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id!: number; 

  @Column({ unique: true })
  nombre!: string; 

  // Esta es la relación inversa. Le dice a TypeORM que busque en la entidad Usuario
  @ManyToMany(() => Usuario, (usuario) => usuario.roles)
  usuarios!: Usuario[];
}