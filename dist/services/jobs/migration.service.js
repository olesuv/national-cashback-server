"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const csv_to_sql_1 = require("../../utils/csv.to.sql");
const csv_to_sql_2 = require("../../constants/csv-to-sql");
const migration_log_service_1 = require("../migration.log.service");
const product_service_1 = require("../product.service");
let MigrationService = class MigrationService {
    constructor(migrationLogService, productService) {
        this.migrationLogService = migrationLogService;
        this.productService = productService;
        this.csvFilesInfo = [
            {
                fileUrl: csv_to_sql_2.PARSE_URLS.productsUrl,
                tableNames: [csv_to_sql_2.TabeleNames.PRODUCTS],
            },
            {
                fileUrl: csv_to_sql_2.PARSE_URLS.sellersUrl,
                tableNames: [csv_to_sql_2.TabeleNames.SELLERS],
            },
        ];
    }
    async onModuleInit() {
        console.log('Running migration (csv to sql)...');
        await this.runMigrations();
    }
    async runDailyMigration() {
        console.log('Started scheduled migration (csv to sql)...');
        await this.runMigrations();
    }
    async runMigration(csvInfo) {
        console.log(`Migrating ${csvInfo.fileUrl} to ${csvInfo.tableNames.join(', ')}...`);
        const csvToSQLMigration = new csv_to_sql_1.CSVtoSQLMigration(this.migrationLogService, this.productService);
        const migrateToSQLDTO = {
            fileUrl: csvInfo.fileUrl,
            tableName: csvInfo.tableNames,
        };
        await csvToSQLMigration.migrateToSQL(migrateToSQLDTO);
        console.log(`Migration completed for ${csvInfo.fileUrl}`);
    }
    async runMigrations() {
        for (const csvInfo of this.csvFilesInfo) {
            await this.runMigration(csvInfo);
        }
    }
};
exports.MigrationService = MigrationService;
__decorate([
    (0, schedule_1.Cron)('0 0 3 * * 6'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MigrationService.prototype, "runDailyMigration", null);
exports.MigrationService = MigrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [migration_log_service_1.MigrationLogService,
        product_service_1.ProductService])
], MigrationService);
//# sourceMappingURL=migration.service.js.map