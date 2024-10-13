import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

import { MigrationLog } from './models/migration.log.entity';
import { Product } from './models/products.entity';

import { MigrationService } from './services/jobs/migration.service';
import { MigrationLogService } from './services/migration.log.service';
import { ProductService } from './services/product.service';
import { CacheConfigService } from './services/redis.config.service';
import { RedisService } from './services/redis.service';

import { AppController } from './controllers/app.controller';
import { ProductController } from './controllers/product.controller';

import { EnvConfigs } from './configs/env';
import { RateLimitMiddleware } from './middleware';
import { ProductApiService } from './services/api/product-api.service';

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
    CacheModule.registerAsync({ useClass: CacheConfigService }),
    TypeOrmModule.forFeature([MigrationLog, Product]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, ProductController],
  providers: [
    MigrationService,
    MigrationLogService,
    ProductService,
    RedisService,
    CacheConfigService,
    ProductApiService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
