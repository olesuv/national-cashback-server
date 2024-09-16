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
    return this.productRepository.find({ where: { brand } });
  }

  async searchByProductName(productName: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.product_name ILIKE :name', { name: `%${productName}%` })
      .getMany();
  }
}
