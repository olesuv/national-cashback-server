import { Entity, Column, Index, Unique } from 'typeorm';

@Entity('products')
export class Product {
  @Index('idx_barcode')
  @Unique(['uq_barcode'])
  @Column()
  barcode: number;

  @Column()
  brand: string;

  @Index('idx_product_name')
  @Column()
  product_name: string;

  @Column()
  short_name: string;

  @Column()
  legal_name: string;

  @Column()
  edrpou: string;

  @Column()
  rnokpp: string;

  @Column()
  updated_at: string;

  @Column()
  created_at: string;
}
