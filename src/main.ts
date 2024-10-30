import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cấu hình CORS để cho phép từ nhiều nguồn
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        `${process.env.LINK_PUBLIC_WEBSITE}`, `${process.env.LINK_LOCALHOST}`
      ];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  });
  await app.listen(3003);
}
bootstrap();

