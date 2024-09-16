import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EnvConfigs } from './configs/env';

import { MigrationLog } from './models/migration.log.entity';

import { MigrationService } from './services/jobs/migration.service';
import { MigrationLogService } from './services/migration.log.service';
import { Product } from './models/products.entity';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';

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
