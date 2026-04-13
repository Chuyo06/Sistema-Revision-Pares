import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manuscrito, ManuscritoDocument } from './schemas/manuscrito.schema';

@Injectable()
export class ManuscritosService {
  constructor(
    @InjectModel(Manuscrito.name) private manuscritoModel: Model<ManuscritoDocument>,
  ) {}

  async crear(datos: Partial<Manuscrito>): Promise<Manuscrito> {
    const nuevoManuscrito = new this.manuscritoModel(datos);
    return await nuevoManuscrito.save();
  }

  async obtenerTodos(): Promise<Manuscrito[]> {
    return await this.manuscritoModel.find().exec();
  }
}