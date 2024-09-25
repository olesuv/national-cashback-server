import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { REDIS_TTL } from 'src/constants/redis.config';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      url: process.env.REDIS_URL,
      ttl: REDIS_TTL,
    };
  }
}
