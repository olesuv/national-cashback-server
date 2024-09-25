import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
// import type { RedisClientOptions } from 'redis';
// import * as redisStore from 'cache-manager-redis-store';
import { REDIS_TTL } from 'src/constants/redis.config';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      url: `redis://default:UN0w24rI41nREpv9zLfcHH4ABUacDfNG@redis-11289.c300.eu-central-1-1.ec2.redns.redis-cloud.com:11289`,
      ttl: REDIS_TTL,
    };
  }
}
