import { Entity, Column, Index, Unique, PrimaryColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'bigint' })
  @Index('idx_barcode', { unique: true })
  @Unique(['uq_barcode'])
  barcode: number;

  @Column({ nullable: true })
  brand: string;

  @Index('idx_product_name')
  @Column({ nullable: true })
  product_name: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ nullable: true })
  legal_name: string;

  @Column({ nullable: true })
  edrpou: string;

  @Column({ nullable: true })
  rnokpp: string;

  @Column({ nullable: true })
  updated_at: string;

  @Column({ nullable: true })
  created_at: string;
}
