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

  async getSearchResults(searchQuery: string, limit: number, offset: number): Promise<Partial<Product>[] | null> {
    const result = await this.cacheManager.get<Product[]>(`search_${searchQuery}_${limit}_${offset}`);
    return result || null;
  }

  async insertSearchResults(searchQuery: string, searchResults: Partial<Product>[], limit: number, offset: number) {
    await this.cacheManager.set(`search_${searchQuery}_${limit}_${offset}`, searchResults);
  }
}
