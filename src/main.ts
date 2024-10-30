import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [`${process.env.LINK_PUBLIC_WEBSITE}`, `${process.env.LINK_LOCALHOST}`], // Địa chỉ frontend React
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  console.log(process.env.LINK_PUBLIC_WEBSITE)
  await app.listen(3003);
}
bootstrap();

