import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
export declare class CacheConfigService implements CacheOptionsFactory {
    createCacheOptions(): CacheModuleOptions;
}
