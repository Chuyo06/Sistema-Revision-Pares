import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Convocatoria, ConvocatoriaDocument } from '../schemas/convocatoria.schema';

@Injectable()
export class ConvocatoriasService implements OnModuleInit {
  constructor(
    @InjectModel(Convocatoria.name) private convocatoriaModel: Model<ConvocatoriaDocument>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const count = await this.convocatoriaModel.countDocuments();
    if (count === 0) {
      console.log('[Seed] Creando convocatoria inicial...');
      await this.crear({
        nombre: 'Congreso Internacional de Ingeniería 2024',
        fechaInicio: new Date().toISOString(),
        fechaLimite: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        areasTematicas: ['IA', 'Software Engineering', 'Networks']
      });
    }
  }

  async crear(datos: Partial<Convocatoria>): Promise<Convocatoria> {
    const nueva = new this.convocatoriaModel(datos);
    return await nueva.save();
  }

  async obtenerTodas(): Promise<Convocatoria[]> {
    return await this.convocatoriaModel.find().sort({ createdAt: -1 }).exec();
  }

  async obtenerPorId(id: string): Promise<Convocatoria> {
    const c = await this.convocatoriaModel.findById(id).exec();
    if (!c) throw new NotFoundException('Convocatoria no encontrada');
    return c;
  }

  async actualizar(id: string, datos: Partial<Convocatoria>): Promise<Convocatoria> {
    const c = await this.convocatoriaModel.findByIdAndUpdate(id, datos, { new: true }).exec();
    if (!c) throw new NotFoundException('Convocatoria no encontrada');
    return c;
  }

  async eliminar(id: string): Promise<boolean> {
    const result = await this.convocatoriaModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
