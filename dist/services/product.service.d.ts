import { Repository } from 'typeorm';
import { Product } from '../models/products.entity';
export interface ReindexDTO {
    tableName: string;
    columnNames: string[];
}
export declare class ProductService {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    findByBarcode(barcode: number): Promise<Product | undefined>;
    findByBrand(brand: string): Promise<Product[]>;
    searchByProductName(productName: string, limit: number, offset: number): Promise<Partial<Product>[]>;
    reindexTable(indexInfo: ReindexDTO): Promise<void>;
    findEctProductInfo(barcode: number): Promise<Partial<Product> | undefined>;
}
