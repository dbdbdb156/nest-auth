import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4000', // ✅ React 서버 주소
    credentials: true,               // 쿠키/인증 정보 포함 허용 (필요 시)
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
