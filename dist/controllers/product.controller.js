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
const product_api_service_1 = require("../services/api/product-api.service");
let ProductController = class ProductController {
    constructor(productApiService) {
        this.productApiService = productApiService;
    }
    async searchByBarcode(barcode) {
        return await this.productApiService.searchBarcode({ barcode });
    }
    async searchProducts(name, limit, offset) {
        return await this.productApiService.searchByName({ name, limit, offset });
    }
    async searchEctProductInfo(barcode) {
        return await this.productApiService.searchEctInfo({ barcode });
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
    __metadata("design:paramtypes", [product_api_service_1.ProductApiService])
], ProductController);
//# sourceMappingURL=product.controller.js.map