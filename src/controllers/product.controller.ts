import { Controller, Get, Query } from '@nestjs/common';
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
  async searchProducts(@Query('name') name: string): Promise<Product[]> {
    return await this.productService.searchByProductName(name);
  }
}
