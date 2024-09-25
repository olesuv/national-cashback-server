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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../services/product.service");
const product_1 = require("../constants/product");
const redis_service_1 = require("../services/redis.service");
let ProductController = class ProductController {
    constructor(productService, redisService) {
        this.productService = productService;
        this.redisService = redisService;
    }
    async searchByBarcode(userBarcode) {
        if (!userBarcode) {
            throw new common_1.NotFoundException('No barcode was provided');
        }
        const cachedRes = await this.redisService.getBarcodeResults(userBarcode);
        if (cachedRes) {
            return cachedRes;
        }
        const searchRes = await this.productService.findByBarcode(userBarcode);
        if (!searchRes) {
            throw new common_1.NotFoundException('Nothing found');
        }
        await this.redisService.insertBarcodeResults(userBarcode, searchRes);
        return searchRes;
    }
    async searchProducts(name, limit, offset) {
        if (!name) {
            throw new common_1.NotFoundException('No search text was provided');
        }
        const parsedLimit = limit ? parseInt(limit, 10) : product_1.searchDefaultParams.limit;
        const parsedOffset = offset ? parseInt(offset, 10) : product_1.searchDefaultParams.offset;
        const cachedRes = await this.redisService.getSearchResults(name, parsedLimit, parsedOffset);
        if (cachedRes) {
            return cachedRes;
        }
        const searchRes = await this.productService.searchByProductName(name, parsedLimit, parsedOffset);
        if (!searchRes || searchRes.length === 0) {
            throw new common_1.NotFoundException('Nothing found');
        }
        await this.redisService.insertSearchResults(name, searchRes, parsedLimit, parsedOffset);
        return searchRes;
    }
    async searchEctProductInfo(barcode) {
        if (!barcode) {
            throw new common_1.NotFoundException('No barcode was provided');
        }
        const cachedProductInfo = await this.redisService.getEctProductInfo(barcode);
        if (cachedProductInfo) {
            return cachedProductInfo;
        }
        const searchRes = await this.productService.findEctProductInfo(barcode);
        if (!searchRes) {
            throw new common_1.NotFoundException('Nothing found');
        }
        await this.redisService.setEctProductInfo(barcode, searchRes);
        return searchRes;
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)('search-barcode'),
    __param(0, (0, common_1.Query)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchByBarcode", null);
__decorate([
    (0, common_1.Get)('search-name'),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('search-ect-info'),
    __param(0, (0, common_1.Query)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchEctProductInfo", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        redis_service_1.RedisService])
], ProductController);
//# sourceMappingURL=product.controller.js.map