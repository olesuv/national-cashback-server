import { ProductService } from '../services/product.service';
import { Product } from '../models/products.entity';
import { RedisService } from 'src/services/redis.service';
export declare class ProductController {
    private readonly productService;
    private readonly redisService;
    constructor(productService: ProductService, redisService: RedisService);
    searchByBarcode(userBarcode: number): Promise<Product>;
    searchProducts(name: string, limit?: string, offset?: string): Promise<Partial<Product>[]>;
    searchEctProductInfo(barcode: number): Promise<Partial<Product>>;
}
