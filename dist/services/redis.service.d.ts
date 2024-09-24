import { Cache } from 'cache-manager';
import { Product } from 'src/models/products.entity';
export declare class RedisService {
    private cacheManager;
    constructor(cacheManager: Cache);
    getBarcodeResults(searchedBarcode: number): Promise<Product | null>;
    insertBarcodeResults(searchedBarcode: number, barcodeData: Product): Promise<void>;
    getSearchResults(searchQuery: string): Promise<Product[] | null>;
    insertSearchResults(searchQuery: string, searchResults: Product[]): Promise<void>;
}
