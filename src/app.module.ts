import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfigs } from './configs/env';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const envConfigs = new EnvConfigs();
        return {
          type: 'postgres',
          url: envConfigs.supabaseURL,
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: envConfigs.devMode,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
