import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function bootstrap(): Promise<INestApplication> {
  const server = express();
  const adapter = new ExpressAdapter(server);

  app = await NestFactory.create(AppModule, adapter);
  app.enableCors();

  await app.init();
  return app;
}

export default async function handler(req: express.Request, res: express.Response) {
  if (!app) {
    app = await bootstrap();
  }

  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance(req, res);
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  });
}
