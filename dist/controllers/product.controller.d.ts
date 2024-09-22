import { ProductService } from '../services/product.service';
import { Product } from '../models/products.entity';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    searchByBarcode(userBarcode: number): Promise<Product>;
    searchProducts(name: string, limit?: string, offset?: string): Promise<Partial<Product>[]>;
    searchEctProductInfo(barcode: number): Promise<Partial<Product>>;
}
