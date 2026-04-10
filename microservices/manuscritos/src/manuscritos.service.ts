import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manuscrito } from './entities/manuscrito.entity';

@Injectable()
export class ManuscritosService {
  constructor(
    @InjectRepository(Manuscrito)
    private manuscritoRepository: Repository<Manuscrito>,
  ) {}

  async crear(datos: Partial<Manuscrito>): Promise<Manuscrito> {
    const nuevo = this.manuscritoRepository.create(datos);
    return await this.manuscritoRepository.save(nuevo);
  }

  async obtenerTodos(): Promise<Manuscrito[]> {
    return await this.manuscritoRepository.find();
  }
}