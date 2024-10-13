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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const migration_log_entity_1 = require("../../models/migration.log.entity");
const typeorm_2 = require("typeorm");
let MigrationLogService = class MigrationLogService {
    constructor(migrationLogRepo) {
        this.migrationLogRepo = migrationLogRepo;
    }
    async createMigrationLog(createMigrationLog) {
        const mbCreated = await this.findByTableName(createMigrationLog);
        if (mbCreated) {
            return await this.updateMigrationLog(createMigrationLog);
        }
        const newMigrationLog = this.migrationLogRepo.create({
            tableName: createMigrationLog.tableName,
        });
        return await this.migrationLogRepo.save(newMigrationLog);
    }
    async updateMigrationLog(migrationLog) {
        const existingLog = await this.findByTableName(migrationLog);
        existingLog.updatedAt = new Date();
        return await this.migrationLogRepo.save(existingLog);
    }
    async findByTableName(migrationLog) {
        const findMigrationLog = await this.migrationLogRepo.findOne({
            where: { tableName: migrationLog.tableName },
        });
        if (!findMigrationLog) {
            throw new common_1.NotFoundException(`Migration log for file ${migrationLog.tableName} not found`);
        }
        return findMigrationLog;
    }
};
exports.MigrationLogService = MigrationLogService;
exports.MigrationLogService = MigrationLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(migration_log_entity_1.MigrationLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MigrationLogService);
//# sourceMappingURL=migration-log.service.js.map