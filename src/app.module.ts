import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { MigrationLog } from './models/migration.log.entity';
import { Product } from './models/products.entity';

import { MigrationService } from './services/jobs/migration.service';
import { MigrationLogService } from './services/migration.log.service';
import { ProductService } from './services/product.service';

import { AppController } from './controllers/app.controller';
import { ProductController } from './controllers/product.controller';

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
    TypeOrmModule.forFeature([MigrationLog, Product]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, ProductController],
  providers: [MigrationService, MigrationLogService, ProductService],
})
export class AppModule {}
