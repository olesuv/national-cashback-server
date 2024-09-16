import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/products.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search-barcode')
  async searchByBarcode(
    @Query('barcode') userBarcode: number,
  ): Promise<Product> {
    return await this.productService.findByBarcode(userBarcode);
  }

  @Get('search-name')
  async searchProducts(
    @Query('name') name: string,
  ): Promise<Partial<Product>[] | HttpException> {
    if (!name) {
      return new HttpException('No search text was provided', 400);
    }

    const searchRes = await this.productService.searchByProductName(name);

    if (!searchRes || searchRes.length === 0) {
      return new HttpException('Nothing find', 400);
    }

    return searchRes;
  }
}
