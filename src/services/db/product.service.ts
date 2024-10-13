import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../models/products.entity';
import { EXT_INFO_COLUMNS, SEARCH_COLUMNS } from 'src/constants/db-queries';

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
    return await this.productRepository
      .createQueryBuilder('product')
      .select(SEARCH_COLUMNS)
      .where('product.barcode = :barcode', { barcode })
      .getOne();
  }

  async findByBrand(brand: string): Promise<Product[]> {
    return await this.productRepository.find({ where: { brand } });
  }

  async searchByProductName(productName: string, limit: number, offset: number): Promise<Partial<Product>[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .select(SEARCH_COLUMNS)
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

  async findEctProductInfo(barcode: number): Promise<Partial<Product> | undefined> {
    return await this.productRepository
      .createQueryBuilder('product')
      .select(EXT_INFO_COLUMNS)
      .where('product.barcode = :barcode', { barcode })
      .getOne();
  }
}
