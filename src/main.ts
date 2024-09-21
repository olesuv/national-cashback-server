import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  require('dotenv').config();

  const app = await NestFactory.create(AppModule, { cors: true });

  const port = process.env.PORT || 8080;
  await app.listen(port, () => {
    if (process.env.NODE_ENV !== 'prod') {
      console.log(`Server started on http://localhost:${port}`);
    }
  });
}
bootstrap();
