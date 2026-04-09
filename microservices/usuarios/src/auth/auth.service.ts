import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, passwordPlain: string, nombre: string) {
    // 1. Verificar si el usuario ya existe
    const userExists = await this.usuarioRepository.findOne({ where: { email } });
    if (userExists) throw new BadRequestException('El correo ya está registrado');

    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    // 3. Guardar en MariaDB
    const nuevoUsuario = this.usuarioRepository.create({
      email,
      passwordHash,
      nombre,
    });
    await this.usuarioRepository.save(nuevoUsuario);
    
    return { message: 'Usuario registrado exitosamente' };
  }

  async login(email: string, passwordPlain: string) {
    // 1. Buscar al usuario
    const user = await this.usuarioRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    // 2. Comparar la contraseña ingresada con la encriptada
    const isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    // 3. Generar el Token JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}