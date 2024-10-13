import { Controller, Get, Query } from '@nestjs/common';
import { ProductApiService } from 'src/services/api/product-api.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productApiService: ProductApiService) {}

  @Get('search-barcode')
  async searchByBarcode(@Query('barcode') barcode: number) {
    return await this.productApiService.searchBarcode({ barcode });
  }

  @Get('search-name')
  async searchProducts(@Query('name') name: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return await this.productApiService.searchByName({ name, limit, offset });
  }

  @Get('search-ect-info')
  async searchEctProductInfo(@Query('barcode') barcode: number) {
    return await this.productApiService.searchEctInfo({ barcode });
  }
}
