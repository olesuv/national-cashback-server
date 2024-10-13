import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CSVtoSQLMigration } from '../../utils/csv.to.sql';
import { MigrateToSQLDTO, PARSE_URLS, TabeleNames } from 'src/constants/csv-to-sql';
import { MigrationLogService } from '../microservices/migration-log.service';
import { ProductService } from '../db/product.service';

export interface ICsvInfo {
  fileUrl: string;
  tableNames: string[];
}

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly csvFilesInfo: ICsvInfo[] = [
    {
      fileUrl: PARSE_URLS.productsUrl,
      tableNames: [TabeleNames.PRODUCTS],
    },
    {
      fileUrl: PARSE_URLS.sellersUrl,
      tableNames: [TabeleNames.SELLERS],
    },
  ];

  constructor(
    private readonly migrationLogService: MigrationLogService,
    private readonly productService: ProductService,
  ) {}

  async onModuleInit() {
    console.log('Running migration (csv to sql)...');
    await this.runMigrations();
  }

  @Cron('0 0 3 * * 6') // 3 am each 6 days
  async runDailyMigration() {
    console.log('Started scheduled migration (csv to sql)...');
    await this.runMigrations();
  }

  private async runMigration(csvInfo: ICsvInfo) {
    console.log(`Migrating ${csvInfo.fileUrl} to ${csvInfo.tableNames.join(', ')}...`);

    const csvToSQLMigration = new CSVtoSQLMigration(this.migrationLogService, this.productService);
    const migrateToSQLDTO: MigrateToSQLDTO = {
      fileUrl: csvInfo.fileUrl,
      tableName: csvInfo.tableNames,
    };
    await csvToSQLMigration.migrateToSQL(migrateToSQLDTO);

    console.log(`Migration completed for ${csvInfo.fileUrl}`);
  }

  private async runMigrations() {
    for (const csvInfo of this.csvFilesInfo) {
      await this.runMigration(csvInfo);
    }
  }
}
