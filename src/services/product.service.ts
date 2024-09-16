import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/products.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findByBarcode(barcode: number): Promise<Product | undefined> {
    return await this.productRepository.findOne({ where: { barcode } });
  }

  async findByBrand(brand: string): Promise<Product[]> {
    return await this.productRepository.find({ where: { brand } });
  }

  async searchByProductName(productName: string): Promise<Partial<Product>[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.barcode',
        'product.brand',
        'product.product_name',
        'product.legal_name',
      ])
      .where('product.product_name ILIKE :name', {
        name: `%${productName}%`,
      })
      .getMany();
  }
}
