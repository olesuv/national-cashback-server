import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  require('dotenv').config();

  const app = await NestFactory.create(AppModule, { cors: true });

  await app.listen(8080, () => {
    console.log('server started on http://localhost:8080');
  });
}
bootstrap();
