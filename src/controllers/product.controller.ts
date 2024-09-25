import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/products.entity';
import { searchDefaultParams } from '../constants/product';
import { RedisService } from 'src/services/redis.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly redisService: RedisService,
  ) {}

  @Get('search-barcode')
  async searchByBarcode(@Query('barcode') userBarcode: number): Promise<Product> {
    if (!userBarcode) {
      throw new NotFoundException('No barcode was provided');
    }

    const cachedRes = await this.redisService.getBarcodeResults(userBarcode);
    if (cachedRes) {
      return cachedRes;
    }

    const searchRes = await this.productService.findByBarcode(userBarcode);

    if (!searchRes) {
      throw new NotFoundException('Nothing found');
    }

    await this.redisService.insertBarcodeResults(userBarcode, searchRes);
    return searchRes;
  }

  @Get('search-name')
  async searchProducts(
    @Query('name') name: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Partial<Product>[]> {
    if (!name) {
      throw new NotFoundException('No search text was provided');
    }

    const parsedLimit = limit ? parseInt(limit, 10) : searchDefaultParams.limit;
    const parsedOffset = offset ? parseInt(offset, 10) : searchDefaultParams.offset;

    const cachedRes = await this.redisService.getSearchResults(name, parsedLimit, parsedOffset);
    if (cachedRes) {
      return cachedRes;
    }

    const searchRes = await this.productService.searchByProductName(name, parsedLimit, parsedOffset);

    if (!searchRes || searchRes.length === 0) {
      throw new NotFoundException('Nothing found');
    }

    await this.redisService.insertSearchResults(name, searchRes, parsedLimit, parsedOffset);
    return searchRes;
  }

  @Get('search-ect-info')
  async searchEctProductInfo(@Query('barcode') barcode: number): Promise<Partial<Product>> {
    if (!barcode) {
      throw new NotFoundException('No barcode was provided');
    }

    const searchRes = await this.productService.findEctProductInfo(barcode);

    if (!searchRes) {
      throw new NotFoundException('Nothing found');
    }

    return searchRes;
  }
}
