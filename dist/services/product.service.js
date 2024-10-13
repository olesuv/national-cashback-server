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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const products_entity_1 = require("../models/products.entity");
const db_queries_1 = require("../constants/db-queries");
let ProductService = class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async findByBarcode(barcode) {
        return await this.productRepository
            .createQueryBuilder('product')
            .select(db_queries_1.SEARCH_COLUMNS)
            .where('product.barcode = :barcode', { barcode })
            .getOne();
    }
    async findByBrand(brand) {
        return await this.productRepository.find({ where: { brand } });
    }
    async searchByProductName(productName, limit, offset) {
        return await this.productRepository
            .createQueryBuilder('product')
            .select(db_queries_1.SEARCH_COLUMNS)
            .where('product.product_name ILIKE :name', {
            name: `%${productName}%`,
        })
            .limit(limit)
            .offset(offset)
            .getMany();
    }
    async reindexTable(indexInfo) {
        const queryRunner = this.productRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        try {
            for (const columnName of indexInfo.columnNames) {
                const dropIndexSQL = `drop index if exists idx_${columnName};`;
                const createIndexSQL = `create index idx_${columnName} on public.${indexInfo.tableName} (${columnName} nulls last) where ${columnName} is not null;`;
                await queryRunner.query(dropIndexSQL);
                await queryRunner.query(createIndexSQL);
                console.log(`Successfully reindexed ${indexInfo.tableName} on ${columnName}`);
            }
        }
        catch (error) {
            console.error(`Error reindexing ${indexInfo.tableName}:`, error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findEctProductInfo(barcode) {
        return await this.productRepository
            .createQueryBuilder('product')
            .select(db_queries_1.EXT_INFO_COLUMNS)
            .where('product.barcode = :barcode', { barcode })
            .getOne();
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(products_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map