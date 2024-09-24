import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Product } from 'src/models/products.entity';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getBarcodeResults(searchedBarcode: number): Promise<Product | null> {
    const cachedRes = await this.cacheManager.get<Product>(`barcode_${searchedBarcode}`);
    return cachedRes;
  }

  async insertBarcodeResults(searchedBarcode: number, barcodeData: Product): Promise<void> {
    await this.cacheManager.set(`barcode_${searchedBarcode}`, barcodeData);
  }

  async getSearchResults(searchQuery: string): Promise<Product[] | null> {
    const result = await this.cacheManager.get<Product[]>(searchQuery);
    return result || null;
  }

  async insertSearchResults(searchQuery: string, searchResults: Product[]) {
    await this.cacheManager.set(searchQuery, searchResults);
  }
}
