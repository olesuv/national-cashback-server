import { Cache } from 'cache-manager';
import { Product } from 'src/models/products.entity';
export declare class RedisService {
    private cacheManager;
    constructor(cacheManager: Cache);
    getBarcodeResults(searchedBarcode: number): Promise<Product | null>;
    insertBarcodeResults(searchedBarcode: number, barcodeData: Product): Promise<void>;
    getSearchResults(searchQuery: string, limit: number, offset: number): Promise<Partial<Product>[] | null>;
    insertSearchResults(searchQuery: string, searchResults: Partial<Product>[], limit: number, offset: number): Promise<void>;
    getEctProductInfo(barcode: number): Promise<Partial<Product>>;
    setEctProductInfo(barcode: number, product_ect_info: Partial<Product>): Promise<void>;
}
