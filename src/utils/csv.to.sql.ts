import { createClient } from '@supabase/supabase-js';
import { parse } from 'fast-csv';
import { Readable } from 'stream';
import axios from 'axios';

import { MigrationLogService } from 'src/services/migration.log.service';

export interface IMigrateToSQLDTO {
  fileUrl: string;
  tableName: string;
}

export class CSVtoSQLMigration {
  private supabase: any;
  private readonly batchSize: number = 1000;

  constructor(private readonly migrationLogService: MigrationLogService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string,
    );
  }

  public async migrateToSQL(migrationInfo: IMigrateToSQLDTO) {
    const lastMigration = await this.migrationLogService.findByTableName({
      tableName: migrationInfo.tableName,
    });

    const lastUpdatedAt = lastMigration.updatedAt
      ? new Date(lastMigration.updatedAt)
      : null;
    const lastCreatedAt = lastMigration.createdAt
      ? new Date(lastMigration.createdAt)
      : null;

    const lastMigrationDate =
      lastUpdatedAt && lastCreatedAt
        ? new Date(Math.max(lastUpdatedAt.getTime(), lastCreatedAt.getTime()))
        : lastUpdatedAt || lastCreatedAt;

    const currentDate = new Date();

    if (
      lastMigrationDate &&
      currentDate.getTime() - lastMigrationDate.getTime() <
        6 * 24 * 60 * 60 * 1000
    ) {
      console.log(`Skipping migration for ${migrationInfo.tableName}...`);
      return;
    }

    try {
      const data = await this.parseCSV(migrationInfo.fileUrl);

      const transformedData = this.transformHeaders(
        migrationInfo.tableName,
        data,
      );

      await this.insertIntoSupabaseInBatches(
        transformedData,
        migrationInfo.tableName,
        this.batchSize,
      );

      await this.migrationLogService.createMigrationLog({
        tableName: migrationInfo.tableName,
      });
    } catch (error) {
      console.error('Error during migration CSV to SQL:', error);
    }
  }

  private productsdHeaderMap = {
    'Штрих-код': 'barcode',
    Бренд: 'brand',
    'Назва товару': 'product_name',
    'Коротка назва': 'short_name',
    'Юридична назва': 'legal_name',
    ЄДРПОУ: 'edrpou',
    РНОКПП: 'rnokpp',
    Оновлено: 'updated_at',
    Створено: 'created_at',
  };

  private sellersHeaderMap = {
    Бренд: 'brand',
    'Юридична назва': 'legal_name',
    ЄДРПОУ: 'edrpou',
    РНОКПП: 'rnokpp',
    'Торгових точок': 'shops_n',
    Оновлено: 'updated_at',
    Створено: 'created_at',
  };

  private transformHeaders(tableName: string, data: any[]): any[] {
    let mapName = {};
    if (tableName === 'products') {
      mapName = this.productsdHeaderMap;
    } else if (tableName === 'sellers') {
      mapName = this.sellersHeaderMap;
    } else {
      throw new Error('No available table name selected');
    }

    return data.map((row) => {
      const transformedRow: any = {};

      Object.keys(row).forEach((key) => {
        const newKey = mapName[key] || key;
        transformedRow[newKey] = row[key];
      });

      return transformedRow;
    });
  }

  private async parseCSV(fileUrl: string): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const results: any[] = [];

      try {
        const response = await axios.get(fileUrl, { responseType: 'stream' });
        const stream = response.data as Readable;

        stream
          .pipe(
            parse({
              headers: true,
              delimiter: ';',
            }),
          )
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }

  private async insertIntoSupabaseInBatches(
    data: any[],
    tableName: string,
    batchSize: number,
  ) {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const { data: insertedData, error } = await this.supabase
        .from(tableName)
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch into ${tableName}:`, error);
      }
    }
  }
}
