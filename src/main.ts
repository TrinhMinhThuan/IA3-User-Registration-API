import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: [`${process.env.LINK_PUBLIC_WEBSITE}`, `${process.env.LINK_LOCALHOST}`],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
  }));  
  await app.listen(3003);
}
bootstrap();

