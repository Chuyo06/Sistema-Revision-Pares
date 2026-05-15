import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manuscrito, ManuscritoDocument } from './schemas/manuscrito.schema';
import { Counter, CounterDocument } from './schemas/counter.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ManuscritosService {
  constructor(
    @InjectModel(Manuscrito.name) private manuscritoModel: Model<ManuscritoDocument>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
  ) {}

  // Nota: la validación "convocatoria abierta" se hace en el FRONTEND
  // (NuevoArticuloPage.vue bloquea el envío si no hay convocatorias abiertas).
  // Antes había una validación de respaldo en backend que consultaba la colección
  // de convocatorias, pero generaba 500 cuando el nombre exacto no estaba
  // sincronizado o cuando la fechaLimite venía en formato inesperado.
  // Si se quiere reactivar, manejarla con try/catch y BadRequestException
  // tipados, sin lanzar errores genéricos que el filter de Nest convierta a 500.

  /**
   * Genera la siguiente referencia secuencial atómicamente (sin race condition).
   * Usa findOneAndUpdate con $inc, que es atómico en MongoDB.
   */
  private async siguienteReferencia(): Promise<string> {
    const year = new Date().getFullYear();
    const result = await this.counterModel.findByIdAndUpdate(
      `manuscritos-${year}`,
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    return `RPP-${year}-${String(result.seq).padStart(4, '0')}`;
  }

  async guardarArchivo(archivo: Express.Multer.File) {
    const referencia = await this.siguienteReferencia();

    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
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

  async crear(datos: Partial<Manuscrito> = {}): Promise<Manuscrito> {
    const d = datos || {};
    const estadoFinal = d.estado || 'ENVIADO';

    // Si el front YA proveyó una referencia (porque vino del /upload), respetarla.
    // Si no, generar una nueva atómicamente.
    const ref = d.referencia && d.referencia !== 'PENDIENTE'
      ? d.referencia
      : await this.siguienteReferencia();

    const nuevoManuscrito = new this.manuscritoModel({
      ...d,
      referencia: ref,
      estado: estadoFinal,
      fechaEnvio: d.fechaEnvio || new Date(),
      historialVersiones: d.historialVersiones || (ref ? [{ referencia: ref, fecha: new Date() }] : []),
    });
    return await nuevoManuscrito.save();
  }

  async obtenerTodos(): Promise<Manuscrito[]> {
    return await this.manuscritoModel
      .find({ estado: { $ne: 'BORRADOR' } })
      .sort({ fechaSubida: -1 })
      .exec();
  }

  /**
   * Devuelve los manuscritos del autor.
   * Por default excluye borradores; pasar incluirBorradores=true para verlos.
   */
  async obtenerPorAutor(autorId: number, incluirBorradores = false): Promise<Manuscrito[]> {
    const filter: any = { autorId };
    if (!incluirBorradores) {
      filter.estado = { $ne: 'BORRADOR' };
    }
    return await this.manuscritoModel.find(filter).sort({ fechaSubida: -1 }).exec();
  }

  /** Solo los borradores del autor. */
  async obtenerBorradoresPorAutor(autorId: number): Promise<Manuscrito[]> {
    return await this.manuscritoModel
      .find({ autorId, estado: 'BORRADOR' })
      .sort({ fechaSubida: -1 })
      .exec();
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
