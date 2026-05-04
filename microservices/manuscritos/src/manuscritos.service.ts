import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manuscrito, ManuscritoDocument } from './schemas/manuscrito.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ManuscritosService {
  constructor(
    @InjectModel(Manuscrito.name) private manuscritoModel: Model<ManuscritoDocument>,
  ) {}

  async guardarArchivo(archivo: Express.Multer.File) {
    const count = await this.manuscritoModel.countDocuments();
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
    const count = await this.manuscritoModel.countDocuments();
    const ref = datos.referencia || `RPP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const nuevoManuscrito = new this.manuscritoModel({
      ...datos,
      referencia: ref,
      estado: datos.estado || 'ENVIADO',
      fechaEnvio: datos.fechaEnvio || new Date(),
    });
    return await nuevoManuscrito.save();
  }

  async obtenerTodos(): Promise<Manuscrito[]> {
    return await this.manuscritoModel.find({ estado: { $ne: 'BORRADOR' } }).sort({ fechaSubida: -1 }).exec();
  }

  async obtenerPorAutor(autorId: number): Promise<Manuscrito[]> {
    return await this.manuscritoModel.find({ autorId }).sort({ fechaSubida: -1 }).exec();
  }

  async obtenerPorId(id: string): Promise<Manuscrito | null> {
    return await this.manuscritoModel.findById(id).exec();
  }

  async actualizar(id: string, datos: Partial<Manuscrito>): Promise<Manuscrito | null> {
    return await this.manuscritoModel.findByIdAndUpdate(id, datos, { new: true }).exec();
  }

  async eliminar(id: string): Promise<boolean> {
    const result = await this.manuscritoModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
