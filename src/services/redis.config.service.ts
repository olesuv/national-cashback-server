import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { REDIS_TTL } from 'src/constants/redis-config';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      url: `${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
      ttl: REDIS_TTL,
    };
  }
}
