import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/graphql',
    rateLimit({
      windowMs: 60_000, // 1 daqiqa
      max: 10, // shu 1 daqiqada maksimal 10 ta so‘rov
      standardHeaders: true, // `RateLimit-*` header’lari yuboradi
      legacyHeaders: false, // `X-RateLimit-*` o‘rniga yangi headerlar
      message: 'Too many GraphQL requests, please try again later.',
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
