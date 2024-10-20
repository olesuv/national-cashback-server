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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../constants/api/utils");
const migration_service_1 = require("../services/jobs/migration.service");
const timeout_interceptor_1 = require("../utils/timeout.interceptor");
let AppController = class AppController {
    constructor(csvToSqlService) {
        this.csvToSqlService = csvToSqlService;
    }
    async getHello() {
        await this.csvToSqlService.runDailyMigration();
        return 'wassup from national cashback server';
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseInterceptors)(new timeout_interceptor_1.TimeoutInterceptor(utils_1.MIGRATION_REQ_TIMEOUT)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [migration_service_1.MigrationService])
], AppController);
//# sourceMappingURL=app.controller.js.map