import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manuscrito } from './entities/manuscrito.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ManuscritosService {
  constructor(
    @InjectRepository(Manuscrito)
    private manuscritoRepository: Repository<Manuscrito>,
  ) {}

  async guardarArchivo(archivo: Express.Multer.File) {
    const count = await this.manuscritoRepository.count();
    const referencia = `RPP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filename = `${referencia}.pdf`;
    fs.writeFileSync(path.join(uploadDir, filename), archivo.buffer);

    return {
      referencia,
      nombreArchivo: archivo.originalname,
      tamano: archivo.size,
      mensaje: 'Archivo subido correctamente',
    };
  }

  async crear(datos: Partial<Manuscrito>): Promise<Manuscrito> {
    const count = await this.manuscritoRepository.count();
    const ref = datos.referencia || `RPP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const nuevo = this.manuscritoRepository.create({
      ...datos,
      referencia: ref,
      estado: datos.estado || 'ENVIADO',
      fechaEnvio: datos.fechaEnvio || new Date(),
    });
    return await this.manuscritoRepository.save(nuevo);
  }

  async obtenerTodos(): Promise<Manuscrito[]> {
    return await this.manuscritoRepository.find({
      order: { fechaSubida: 'DESC' },
    });
  }

  async obtenerPorAutor(autorId: number): Promise<Manuscrito[]> {
    return await this.manuscritoRepository.find({
      where: { autorId },
      order: { fechaSubida: 'DESC' },
    });
  }

  async obtenerPorId(id: number): Promise<Manuscrito | null> {
    return await this.manuscritoRepository.findOne({ where: { id } });
  }

  async actualizar(id: number, datos: Partial<Manuscrito>): Promise<Manuscrito | null> {
    await this.manuscritoRepository.update(id, datos);
    return this.obtenerPorId(id);
  }
}
