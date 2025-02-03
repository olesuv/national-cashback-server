import { Entity, Column, Index, Unique, PrimaryColumn } from 'typeorm';

@Entity('sellers')
export class Seller {
  @PrimaryColumn({ type: 'text' })
  @Index('idx_brand', { unique: true })
  brand: string;

  @Column({ nullable: false })
  legal_name: string;

  @Column({ nullable: false })
  @Index('idx_address', { unique: true })
  @Unique(['uq_address'])
  address: string;

  @Column({ nullable: true })
  edrpou: string;

  @Column({ nullable: true })
  rnokpp: string;

  @Column({ nullable: true })
  shops_n: string;

  @Column({ nullable: true })
  updated_at: string;

  @Column({ nullable: true })
  created_at: string;
}
