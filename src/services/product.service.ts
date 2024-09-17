import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/products.entity';

export interface ReindexDTO {
  tableName: string;
  columnNames: string[];
}

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

  async searchByProductName(productName: string, limit: number, offset: number): Promise<Partial<Product>[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .select(['product.barcode', 'product.brand', 'product.product_name', 'product.legal_name'])
      .where('product.product_name ILIKE :name', {
        name: `%${productName}%`,
      })
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async reindexTable(indexInfo: ReindexDTO) {
    const queryRunner = this.productRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      for (const columnName of indexInfo.columnNames) {
        const dropIndexSQL = `drop index if exists idx_${columnName};`;
        const createIndexSQL = `create index idx_${columnName} on public.${indexInfo.tableName} (${columnName} nulls last) where ${columnName} is not null;`;

        await queryRunner.query(dropIndexSQL);
        await queryRunner.query(createIndexSQL);

        console.log(`Successfully reindexed ${indexInfo.tableName} on ${columnName}`);
      }
    } catch (error) {
      console.error(`Error reindexing ${indexInfo.tableName}:`, error);
    } finally {
      await queryRunner.release();
    }
  }
}
