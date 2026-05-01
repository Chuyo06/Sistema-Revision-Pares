import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manuscrito, ManuscritoDocument } from './schemas/manuscrito.schema';

@Injectable()
export class ManuscritosService {
  constructor(
    @InjectModel(Manuscrito.name)
    private manuscritoModel: Model<ManuscritoDocument>,
  ) {}

  async guardarArchivo(archivo: { originalname: string; size: number }) {
    // En Mongoose se usa countDocuments()
    const count = await this.manuscritoModel.countDocuments();
    const referencia = `RPP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return {
      referencia,
      nombreArchivo: archivo.originalname,
      tamano: archivo.size,
      mensaje: 'Archivo subido correctamente',
    };
  }

  async crear(datos: Partial<Manuscrito>): Promise<Manuscrito> {
    const count = await this.manuscritoModel.countDocuments();
    const ref =
      datos.referencia && datos.referencia !== 'PENDIENTE'
        ? datos.referencia
        : `RPP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const nuevo = new this.manuscritoModel({
      ...datos,
      referencia: ref,
      estado: datos.estado || 'pendiente',
      fechaEnvio: datos.fechaEnvio || new Date(),
    });
    return await nuevo.save();
  }

  async obtenerTodos(): Promise<Manuscrito[]> {
    // Usamos createdAt porque SchemaFactory({ timestamps: true }) lo crea en automático
    return await this.manuscritoModel.find().sort({ createdAt: -1 }).exec();
  }

  async obtenerPorAutor(autorId: number): Promise<Manuscrito[]> {
    return await this.manuscritoModel.find({ autorId }).sort({ createdAt: -1 }).exec();
  }

  // ATENCIÓN: El ID en MongoDB es string (ObjectID)
  async obtenerPorId(id: string): Promise<Manuscrito | null> {
    return await this.manuscritoModel.findById(id).exec();
  }

  async actualizar(id: string, datos: Partial<Manuscrito>): Promise<Manuscrito | null> {
    // { new: true } le dice a Mongoose que nos devuelva el objeto YA modificado
    return await this.manuscritoModel.findByIdAndUpdate(id, datos, { new: true }).exec();
  }
}