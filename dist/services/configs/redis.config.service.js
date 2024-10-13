"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheConfigService = void 0;
const common_1 = require("@nestjs/common");
const redis_config_1 = require("../../constants/redis-config");
let CacheConfigService = class CacheConfigService {
    createCacheOptions() {
        return {
            url: `${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
            ttl: redis_config_1.REDIS_TTL,
        };
    }
};
exports.CacheConfigService = CacheConfigService;
exports.CacheConfigService = CacheConfigService = __decorate([
    (0, common_1.Injectable)()
], CacheConfigService);
//# sourceMappingURL=redis.config.service.js.map