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

  async register(email: string, passwordPlain: string, nombre: string) {
    // 1. Verificar si el usuario ya existe
    const userExists = await this.usuarioRepository.findOne({ where: { email } });
    if (userExists) throw new BadRequestException('El correo ya está registrado');

    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    // 3. Buscar el rol AUTOR por defecto
    const autorRol = await this.rolRepository.findOne({ where: { nombre: 'AUTOR' } });

    // 4. Guardar usuario en MariaDB
    const nuevoUsuario = this.usuarioRepository.create({
      email,
      password_hash: passwordHash,
      roles: autorRol ? [autorRol] : [],
    });
    const guardado = await this.usuarioRepository.save(nuevoUsuario);

    // 5. Crear perfil profesional con el nombre
    const perfil = this.perfilRepository.create({
      usuario: guardado,
      nombre_completo: nombre || email.split('@')[0],
    });
    await this.perfilRepository.save(perfil);
    
    return { message: 'Usuario registrado exitosamente' };
  }

  async login(email: string, passwordPlain: string) {
    // 1. Buscar al usuario con su perfil Y SUS ROLES
    const user = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['perfil', 'roles'], 
    });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    // 2. Comparar la contraseña ingresada con la encriptada
    const isPasswordValid = await bcrypt.compare(passwordPlain, user.password_hash);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    // Extraemos solo el nombre de los roles (ej: ['ADMIN', 'AUTOR'])
    const rolesPlanos = user.roles?.map(r => r.nombre) || [];

    // 3. Generar el Token JWT usando los roles planos
    const payload = { sub: user.id_usuario, email: user.email, roles: rolesPlanos };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      id: user.id_usuario,
      nombre: user.perfil?.nombre_completo || user.email.split('@')[0],
      avatar: user.perfil?.avatar || null,
      email: user.email,
      roles: rolesPlanos, 
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
}