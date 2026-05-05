import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':clave')
  async get(@Param('clave') clave: string) {
    return this.configService.getSetting(clave);
  }

  @Post(':clave')
  async set(@Param('clave') clave: string, @Body() body: { valor: any }) {
    return this.configService.setSetting(clave, body.valor);
  }
}
