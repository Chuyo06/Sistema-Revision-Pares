import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from '../entities/usuario.entity';
import { PerfilProfesional } from '../entities/perfil-profesional.entity';
import { Rol } from '../entities/rol.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    @InjectRepository(PerfilProfesional)
    private perfilRepo: Repository<PerfilProfesional>,
    @InjectRepository(Rol)
    private rolRepo: Repository<Rol>,
  ) {}

  async onModuleInit() {
    await this.seedSuperUser();
  }

  private async getOrCreateRoles(nombres: string[]): Promise<Rol[]> {
    const rolesEntities: Rol[] = [];
    for (const nombre of nombres) {
      const nombreUpper = nombre.toUpperCase();
      let rolEnt = await this.rolRepo.findOne({ where: { nombre: nombreUpper } });
      if (!rolEnt) {
        rolEnt = this.rolRepo.create({ nombre: nombreUpper });
        await this.rolRepo.save(rolEnt);
      }
      rolesEntities.push(rolEnt);
    }
    return rolesEntities;
  }

  private async asyncSeed(email: string, nombre: string, roles: string[]) {
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
      relations: ['perfil', 'roles'],
      order: { fecha_registro: 'DESC' },
    });
    return usuarios.map((u) => ({
      id: u.id_usuario,
      nombre: u.perfil?.nombre_completo || u.email.split('@')[0],
      email: u.email,
      roles: u.roles?.map(r => r.nombre.toLowerCase()) || [],
      estado: u.estado.toLowerCase(),
      fechaRegistro: u.fecha_registro,
      institucion: u.perfil?.institucion || null,
    }));
  }

  async obtenerPorId(id: number) {
    const u = await this.usuarioRepo.findOne({
      where: { id_usuario: id },
      relations: ['perfil', 'roles'],
    });
    if (!u) return null;
    return {
      id: u.id_usuario,
      nombre: u.perfil?.nombre_completo || u.email.split('@')[0],
      email: u.email,
      roles: u.roles?.map(r => r.nombre.toLowerCase()) || [],
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
    const rolesEntities = await this.getOrCreateRoles(rolesArray);
    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: id }, relations: ['roles'] });
    if (usuario) {
      usuario.roles = rolesEntities;
      await this.usuarioRepo.save(usuario);
    }
    return this.obtenerPorId(id);
  }

  async actualizarUsuario(id: number, datos: { nombre?: string; email?: string; institucion?: string; especialidad?: string; estado?: string; rol?: string; roles?: string[] }) {
    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: id }, relations: ['perfil', 'roles'] });
    if (!usuario) return null;

    if (datos.email) {
      usuario.email = datos.email;
    }

    if (datos.estado) {
      usuario.estado = datos.estado.toUpperCase() as any;
    }
    
    if (datos.roles) {
      usuario.roles = await this.getOrCreateRoles(datos.roles);
    } else if (datos.rol) {
      usuario.roles = await this.getOrCreateRoles([datos.rol]);
    }

    await this.usuarioRepo.save(usuario);

    if (datos.nombre !== undefined || datos.institucion !== undefined || datos.especialidad !== undefined) {
      let perfil = await this.perfilRepo.findOne({ where: { usuario: { id_usuario: id } } });
      if (!perfil) {
        perfil = this.perfilRepo.create({ usuario, nombre_completo: datos.nombre || '' });
      }
      if (datos.nombre !== undefined) perfil.nombre_completo = datos.nombre;
      if (datos.institucion !== undefined) perfil.institucion = datos.institucion;
      if (datos.especialidad !== undefined) perfil.especialidad_academica = datos.especialidad;
      await this.perfilRepo.save(perfil);
    }

    return this.obtenerPorId(id);
  }

  async crearUsuario(datos: { email: string; password: string; nombre: string; rol?: string; roles?: string[] }) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(datos.password, salt);

    const rolesToSaveStrings = datos.roles 
      ? datos.roles 
      : [(datos.rol || 'AUTOR')];

    const rolesEntities = await this.getOrCreateRoles(rolesToSaveStrings);

    const nuevo = this.usuarioRepo.create({
      email: datos.email,
      password_hash: hash,
      roles: rolesEntities,
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


}
