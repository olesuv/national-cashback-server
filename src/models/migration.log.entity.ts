import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('migration_log')
export class MigrationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  tableName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
