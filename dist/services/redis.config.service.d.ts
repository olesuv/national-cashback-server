import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
export declare class CacheConfigService implements CacheOptionsFactory {
    createCacheOptions(): CacheModuleOptions<RedisClientOptions>;
}
