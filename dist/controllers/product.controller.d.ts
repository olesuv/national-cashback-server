import { ProductApiService } from 'src/services/api/product-api.service';
export declare class ProductController {
    private readonly productApiService;
    constructor(productApiService: ProductApiService);
    searchByBarcode(barcode: number): Promise<import("../models/products.entity").Product>;
    searchProducts(name: string, limit?: string, offset?: string): Promise<Partial<import("../models/products.entity").Product>[]>;
    searchEctProductInfo(barcode: number): Promise<Partial<import("../models/products.entity").Product>>;
}
