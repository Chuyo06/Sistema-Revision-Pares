import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AjusteSistema } from '../entities/ajuste-sistema.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(AjusteSistema)
    private readonly configRepo: Repository<AjusteSistema>,
  ) {}

  async getSetting(clave: string): Promise<any> {
    const setting = await this.configRepo.findOne({ where: { clave } });
    if (!setting) return null;
    try {
      return JSON.parse(setting.valor);
    } catch {
      return setting.valor;
    }
  }

  async setSetting(clave: string, valor: any): Promise<void> {
    const valorStr = typeof valor === 'string' ? valor : JSON.stringify(valor);
    let setting = await this.configRepo.findOne({ where: { clave } });
    if (setting) {
      setting.valor = valorStr;
    } else {
      setting = this.configRepo.create({ clave, valor: valorStr });
    }
    await this.configRepo.save(setting);
  }
}
