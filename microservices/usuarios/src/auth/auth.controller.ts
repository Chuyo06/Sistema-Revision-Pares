import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.nombre);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @Patch('avatar/:id')
  updateAvatar(@Param('id') id: string, @Body('avatar') avatar: string) {
    return this.authService.updateAvatar(Number(id), avatar);
  }
}