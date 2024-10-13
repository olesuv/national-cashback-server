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
exports.ProductApiService = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../product.service");
const redis_service_1 = require("../redis.service");
const search_errors_1 = require("../../constants/errors/search-errors");
const search_product_1 = require("../../constants/api/search-product");
let ProductApiService = class ProductApiService {
    constructor(productService, redisService) {
        this.productService = productService;
        this.redisService = redisService;
    }
    async searchBarcode(userInputs) {
        if (!userInputs.barcode) {
            throw new common_1.NotFoundException('No barcode was provided');
        }
        else if (search_errors_1.rusProductRegex.test(String(userInputs.barcode))) {
            throw new common_1.NotFoundException('Rus product');
        }
        const cachedRes = await this.redisService.getBarcodeResults(userInputs.barcode);
        if (cachedRes) {
            return cachedRes;
        }
        const searchRes = await this.productService.findByBarcode(userInputs.barcode);
        if (!searchRes) {
            throw new common_1.NotFoundException('Nothing found');
        }
        await this.redisService.insertBarcodeResults(userInputs.barcode, searchRes);
        return searchRes;
    }
    async searchByName(userInputs) {
        if (!userInputs.name) {
            throw new common_1.NotFoundException('No search text was provided');
        }
        else if (search_errors_1.rusProductRegex.test(userInputs.name)) {
            throw new common_1.NotFoundException('Rus product');
        }
        const parsedLimit = userInputs.limit ? parseInt(userInputs.limit, 10) : search_product_1.searchDefaultParams.limit;
        const parsedOffset = userInputs.offset ? parseInt(userInputs.offset, 10) : search_product_1.searchDefaultParams.offset;
        const cachedRes = await this.redisService.getSearchResults(userInputs.name, parsedLimit, parsedOffset);
        if (cachedRes) {
            return cachedRes;
        }
        const searchRes = await this.productService.searchByProductName(userInputs.name, parsedLimit, parsedOffset);
        if (!searchRes || searchRes.length === 0) {
            throw new common_1.NotFoundException('Nothing found');
        }
        await this.redisService.insertSearchResults(userInputs.name, searchRes, parsedLimit, parsedOffset);
        return searchRes;
    }
    async searchEctInfo(userInputs) {
        if (!userInputs.barcode) {
            throw new common_1.NotFoundException('No barcode was provided');
        }
        else if (search_errors_1.rusProductRegex.test(String(userInputs.barcode))) {
            throw new common_1.NotFoundException('Rus product');
        }
        const cachedProductInfo = await this.redisService.getEctProductInfo(userInputs.barcode);
        if (cachedProductInfo) {
            return cachedProductInfo;
        }
        const searchRes = await this.productService.findEctProductInfo(userInputs.barcode);
        if (!searchRes) {
            throw new common_1.NotFoundException('Nothing found');
        }
        await this.redisService.setEctProductInfo(userInputs.barcode, searchRes);
        return searchRes;
    }
};
exports.ProductApiService = ProductApiService;
exports.ProductApiService = ProductApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        redis_service_1.RedisService])
], ProductApiService);
//# sourceMappingURL=product-api.service.js.map