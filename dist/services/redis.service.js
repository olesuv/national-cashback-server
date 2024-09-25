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
exports.RedisService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
let RedisService = class RedisService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async getBarcodeResults(searchedBarcode) {
        const cachedRes = await this.cacheManager.get(`barcode_${searchedBarcode}`);
        return cachedRes;
    }
    async insertBarcodeResults(searchedBarcode, barcodeData) {
        await this.cacheManager.set(`barcode_${searchedBarcode}`, barcodeData);
    }
    async getSearchResults(searchQuery, limit, offset) {
        const result = await this.cacheManager.get(`search_${searchQuery}_${limit}_${offset}`);
        return result || null;
    }
    async insertSearchResults(searchQuery, searchResults, limit, offset) {
        await this.cacheManager.set(`search_${searchQuery}_${limit}_${offset}`, searchResults);
    }
    async getEctProductInfo(barcode) {
        return await this.cacheManager.get(`product_ect_info_${barcode}`);
    }
    async setEctProductInfo(barcode, product_ect_info) {
        await this.cacheManager.set(`product_ect_info_${barcode}`, product_ect_info);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], RedisService);
//# sourceMappingURL=redis.service.js.map