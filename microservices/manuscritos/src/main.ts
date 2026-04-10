import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Esto hace que el microservicio ignore cualquier sub-ruta extra que mande Nginx
  app.setGlobalPrefix(''); 
  
  await app.listen(3000);
}
bootstrap();