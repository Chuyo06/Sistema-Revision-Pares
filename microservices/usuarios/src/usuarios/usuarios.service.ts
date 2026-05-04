import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from '../entities/usuario.entity';
import { PerfilProfesional } from '../entities/perfil-profesional.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    @InjectRepository(PerfilProfesional)
    private perfilRepo: Repository<PerfilProfesional>,
  ) {}

  async onModuleInit() {
    await this.seedSuperUser();
  }

  private async asyncSeed(email: string, nombre: string, roles: RolUsuario[]) {
    const exists = await this.usuarioRepo.findOne({ where: { email } });
    if (!exists) {
      console.log(`[Seed] Creando usuario: ${email}`);
      await this.crearUsuario({
        email,
        password: '1234',
        nombre,
        roles
      });
    }
  }

  private async seedSuperUser() {
    await this.asyncSeed('admin@demo.com', 'Admin Sistema', [RolUsuario.ADMIN, RolUsuario.EDITOR, RolUsuario.REVISOR, RolUsuario.AUTOR]);
    await this.asyncSeed('editor@demo.com', 'Dr. Martínez (Editor)', [RolUsuario.EDITOR, RolUsuario.REVISOR]);
    await this.asyncSeed('revisor@demo.com', 'Carlos López (Revisor)', [RolUsuario.REVISOR, RolUsuario.AUTOR]);
    await this.asyncSeed('autor@demo.com', 'Ana García (Autor)', [RolUsuario.AUTOR]);
  }

  async obtenerTodos() {
    const usuarios = await this.usuarioRepo.find({
      relations: ['perfil'],
      order: { fecha_registro: 'DESC' },
    });
    return usuarios.map((u) => ({
      id: u.id_usuario,
      nombre: u.perfil?.nombre_completo || u.email.split('@')[0],
      email: u.email,
      roles: u.roles.map(r => r.toLowerCase()),
      estado: u.estado.toLowerCase(),
      fechaRegistro: u.fecha_registro,
      institucion: u.perfil?.institucion || null,
    }));
  }

  async obtenerPorId(id: number) {
    const u = await this.usuarioRepo.findOne({
      where: { id_usuario: id },
      relations: ['perfil'],
    });
    if (!u) return null;
    return {
      id: u.id_usuario,
      nombre: u.perfil?.nombre_completo || u.email.split('@')[0],
      email: u.email,
      roles: u.roles.map(r => r.toLowerCase()),
      estado: u.estado.toLowerCase(),
      fechaRegistro: u.fecha_registro,
      institucion: u.perfil?.institucion || null,
      especialidad: u.perfil?.especialidad_academica || null,
    };
  }

  async actualizarEstado(id: number, estado: string) {
    await this.usuarioRepo.update(id, { estado: estado.toUpperCase() as any });
    return this.obtenerPorId(id);
  }

  async actualizarRol(id: number, rol: string | string[]) {
    const rolesArray = Array.isArray(rol) ? rol : [rol];
    await this.usuarioRepo.update(id, { roles: rolesArray.map(r => r.toUpperCase()) as any });
    return this.obtenerPorId(id);
  }

  async crearUsuario(datos: { email: string; password: string; nombre: string; rol?: string; roles?: string[] }) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(datos.password, salt);

    const rolesToSave = datos.roles 
      ? datos.roles.map(r => r.toUpperCase() as any) 
      : [(datos.rol?.toUpperCase() || 'AUTOR') as any];

    const nuevo = this.usuarioRepo.create({
      email: datos.email,
      password_hash: hash,
      roles: rolesToSave,
    });
    const guardado = await this.usuarioRepo.save(nuevo);

    // Crear perfil
    const perfil = this.perfilRepo.create({
      usuario: guardado,
      nombre_completo: datos.nombre,
    });
    await this.perfilRepo.save(perfil);

    return this.obtenerPorId(guardado.id_usuario);
  }

  async actualizarUsuario(id: number, datos: { nombre?: string; email?: string; rol?: string; roles?: string[] }) {
    // Buscar usuario con su perfil
    const u = await this.usuarioRepo.findOne({
      where: { id_usuario: id },
      relations: ['perfil'],
    });

    if (!u) return null;

    // Actualizar campos base
    if (datos.email) u.email = datos.email;
    
    // Actualizar roles
    if (datos.roles) {
      u.roles = datos.roles.map(r => r.toUpperCase()) as any;
    } else if (datos.rol) {
      // Si pasan un solo rol nuevo pero queremos mantener array de 1 rol
      u.roles = [datos.rol.toUpperCase()] as any;
    }

    await this.usuarioRepo.save(u);

    // Actualizar perfil si se proporcionó un nombre
    if (datos.nombre && u.perfil) {
      u.perfil.nombre_completo = datos.nombre;
      await this.perfilRepo.save(u.perfil);
    } else if (datos.nombre && !u.perfil) {
      // En caso de que no tenga perfil, lo creamos
      const nuevoPerfil = this.perfilRepo.create({
        usuario: u,
        nombre_completo: datos.nombre,
      });
      await this.perfilRepo.save(nuevoPerfil);
    }

    return this.obtenerPorId(id);
  }
}
