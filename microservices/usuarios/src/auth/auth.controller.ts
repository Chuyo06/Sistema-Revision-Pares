import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @Patch('avatar/:id')
  updateAvatar(@Param('id') id: string, @Body('avatar') avatar: string) {
    return this.authService.updateAvatar(Number(id), avatar);
  }

  @Patch('password/:id')
  cambiarPassword(
    @Param('id') id: string,
    @Body() body: { passwordActual: string; passwordNueva: string }
  ) {
    return this.authService.cambiarPassword(Number(id), body.passwordActual, body.passwordNueva);
  }
}