"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const cache_manager_1 = require("@nestjs/cache-manager");
const migration_log_entity_1 = require("./models/migration.log.entity");
const products_entity_1 = require("./models/products.entity");
const migration_service_1 = require("./services/jobs/migration.service");
const migration_log_service_1 = require("./services/migration.log.service");
const product_service_1 = require("./services/product.service");
const redis_config_service_1 = require("./services/redis.config.service");
const redis_service_1 = require("./services/redis.service");
const app_controller_1 = require("./controllers/app.controller");
const product_controller_1 = require("./controllers/product.controller");
const env_1 = require("./configs/env");
const middleware_1 = require("./middleware");
const product_api_service_1 = require("./services/api/product-api.service");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(middleware_1.RateLimitMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => {
                    const envConfigs = new env_1.EnvConfigs();
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
            cache_manager_1.CacheModule.registerAsync({ useClass: redis_config_service_1.CacheConfigService }),
            typeorm_1.TypeOrmModule.forFeature([migration_log_entity_1.MigrationLog, products_entity_1.Product]),
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [app_controller_1.AppController, product_controller_1.ProductController],
        providers: [
            migration_service_1.MigrationService,
            migration_log_service_1.MigrationLogService,
            product_service_1.ProductService,
            redis_service_1.RedisService,
            redis_config_service_1.CacheConfigService,
            product_api_service_1.ProductApiService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map