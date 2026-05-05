import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { PerfilProfesional } from '../entities/perfil-profesional.entity';
import { Rol } from '../entities/rol.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(PerfilProfesional)
    private perfilRepository: Repository<PerfilProfesional>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    private jwtService: JwtService,
  ) {}

  async register(body: any) {
    const { email, password, nombre, rol, especialidad, palabras_clave, experiencia } = body;
    // 1. Verificar si el usuario ya existe
    const userExists = await this.usuarioRepository.findOne({ where: { email } });
    if (userExists) throw new BadRequestException('El correo ya está registrado');

    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Buscar rol, si no se envía o no existe, default a AUTOR
    const nombreRol = rol || 'AUTOR';
    let rolDb = await this.rolRepository.findOne({ where: { nombre: nombreRol } });
    if (!rolDb) {
      rolDb = await this.rolRepository.findOne({ where: { nombre: 'AUTOR' } });
    }

    // 3. Guardar usuario en MariaDB con rol
    const nuevoUsuario = this.usuarioRepository.create({
      email,
      password_hash: passwordHash,
      roles: rolDb ? [rolDb] : [],
    });
    const guardado = await this.usuarioRepository.save(nuevoUsuario);

    // 4. Crear perfil profesional
    const perfil = this.perfilRepository.create({
      usuario: guardado,
      nombre_completo: nombre || email.split('@')[0],
      especialidad_academica: rol === 'REVISOR' ? especialidad : null,
      palabras_clave: rol === 'REVISOR' ? palabras_clave : null,
      experiencia: rol === 'REVISOR' ? experiencia : null,
    });
    await this.perfilRepository.save(perfil);
    
    return { message: 'Usuario registrado exitosamente' };
  }

  async login(email: string, passwordPlain: string) {
    console.log(`[Auth] Intento de login para: ${email}`);
    // 1. Buscar al usuario con su perfil y roles
    const user = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['perfil', 'roles'],
    });
    
    if (!user) {
      console.log(`[Auth] Usuario no encontrado: ${email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Comparar la contraseña ingresada con la encriptada
    const isPasswordValid = await bcrypt.compare(passwordPlain, user.password_hash);
    if (!isPasswordValid) {
      console.log(`[Auth] Contraseña inválida para: ${email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    console.log(`[Auth] Login exitoso: ${email}`);

    // 3. Generar el Token JWT
    const rolesArray = user.roles?.map(r => r.nombre) || [];
    const payload = { sub: user.id_usuario, email: user.email, roles: rolesArray };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      id: user.id_usuario,
      nombre: user.perfil?.nombre_completo || user.email.split('@')[0],
      avatar: user.perfil?.avatar || null,
      email: user.email,
      roles: rolesArray,
    };
  }

  async updateAvatar(id_usuario: number, base64Image: string) {
    const perfil = await this.perfilRepository.findOne({ 
      where: { usuario: { id_usuario } } 
    });
    
    if (!perfil) {
      throw new BadRequestException('Perfil no encontrado para este usuario');
    }
    
    perfil.avatar = base64Image;
    await this.perfilRepository.save(perfil);
    return { success: true, message: 'Avatar actualizado exitosamente' };
  }

  async cambiarPassword(id_usuario: number, passwordActual: string, passwordNueva: string) {
    const user = await this.usuarioRepository.findOne({ where: { id_usuario } });
    if (!user) throw new BadRequestException('Usuario no encontrado');

    // Verificar que la contraseña actual es correcta
    const isValid = await bcrypt.compare(passwordActual, user.password_hash);
    if (!isValid) throw new UnauthorizedException('La contraseña actual no es correcta');

    // Encriptar y guardar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(passwordNueva, salt);
    await this.usuarioRepository.save(user);

    return { success: true, message: 'Contraseña actualizada correctamente' };
  }
}