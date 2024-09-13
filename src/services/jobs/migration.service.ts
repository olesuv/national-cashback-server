import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CSVtoSQLMigration } from '../../utils/csv.to.sql';
import { MigrationLogService } from '../migration.log.service';

export interface ICsvInfo {
  fileUrl: string;
  tableName: string;
}

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly csvFilesInfo: ICsvInfo[] = [
    {
      fileUrl:
        'https://madeinukraine.gov.ua/files/perelik-tovariv/products.csv',
      tableName: 'products',
    },
    {
      fileUrl:
        'https://madeinukraine.gov.ua/files/perelik-prodavtsiv/perelik-prodavtsiv.csv',
      tableName: 'sellers',
    },
  ];

  constructor(private readonly migrationLogService: MigrationLogService) {}

  async onModuleInit() {
    console.log('server started, running migration(csv to sql)...');
    await this.runMigrations();
  }

  @Cron('0 3 * * 6') // 3 am each 6 days
  async runDailyMigration() {
    console.log('started daily migration');
    await this.runMigrations();
  }

  private async runMigration(csvInfo: ICsvInfo) {
    console.log(`migrating ${csvInfo.fileUrl} to ${csvInfo.tableName}...`);

    const csvToSQLMigration = new CSVtoSQLMigration(this.migrationLogService);
    await csvToSQLMigration.migrateToSQL({
      fileUrl: csvInfo.fileUrl,
      tableName: csvInfo.tableName,
    });

    console.log(`migration completed for ${csvInfo.fileUrl}`);
  }

  private async runMigrations() {
    for (const csvInfo of this.csvFilesInfo) {
      await this.runMigration(csvInfo);
    }
  }
}
