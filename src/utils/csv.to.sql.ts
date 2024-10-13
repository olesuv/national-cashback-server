import { createClient } from '@supabase/supabase-js';
import { parse } from 'fast-csv';
import { Readable } from 'stream';
import axios from 'axios';

import { MigrationLogService } from 'src/services/microservices/migration-log.service';
import { ProductService } from 'src/services/db/product.service';
import {
  ColumnNames,
  MigrateToSQLDTO,
  productsdHeaderMap,
  sellersHeaderMap,
  TabeleNames,
} from 'src/constants/csv-to-sql';
import { DuplicateValuesErrorCode } from 'src/constants/errors/supabase-errors';

export class CSVtoSQLMigration {
  private supabase: any;
  private readonly batchSize: number = 1000;

  constructor(
    private readonly migrationLogService: MigrationLogService,
    private readonly productService: ProductService,
  ) {
    this.supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string);
  }

  public async migrateToSQL(migrationInfo: MigrateToSQLDTO) {
    for (const tableName of migrationInfo.tableName) {
      const lastMigration = await this.migrationLogService.findByTableName({
        tableName: tableName,
      });

      const lastUpdatedAt = lastMigration?.updatedAt ? new Date(lastMigration.updatedAt) : null;
      const lastCreatedAt = lastMigration?.createdAt ? new Date(lastMigration.createdAt) : null;

      const lastMigrationDate =
        lastUpdatedAt && lastCreatedAt
          ? new Date(Math.max(lastUpdatedAt.getTime(), lastCreatedAt.getTime()))
          : lastUpdatedAt || lastCreatedAt;

      const currentDate = new Date();

      if (lastMigrationDate && currentDate.getTime() - lastMigrationDate.getTime() < 6 * 24 * 60 * 60 * 1000) {
        console.log(`Skipping migration for ${tableName}...`);
        continue;
      }

      try {
        const data = await this.parseCSV(migrationInfo.fileUrl);

        const transformedData = this.transformHeaders(tableName, data);

        await this.deleteTableData(tableName, ColumnNames.BRAND);

        await this.insertIntoSupabaseInBatches(transformedData, tableName, this.batchSize);

        await this.migrationLogService.createMigrationLog({ tableName: tableName });

        console.log(`Successfully migrated data for ${tableName}`);
      } catch (error) {
        console.error(`Error during migration CSV to SQL for ${tableName}:`, error);
      }
    }
  }

  private transformHeaders(tableName: string, data: any[]): any[] {
    let mapName = {};
    if (tableName === 'products') {
      mapName = productsdHeaderMap;
    } else if (tableName === 'sellers') {
      mapName = sellersHeaderMap;
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

  private async insertIntoSupabaseInBatches(data: any[], tableName: string, batchSize: number) {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const { error } = await this.supabase.from(tableName).insert(batch);

      if (error) {
        if (error.code === DuplicateValuesErrorCode) {
          continue;
        }

        console.error(`Error inserting batch into ${tableName}:`, error);
      }
    }

    const indexColumnNames = await this.getIndexColumnName(tableName);
    await this.productService.reindexTable({
      tableName: tableName,
      columnNames: indexColumnNames,
    });
  }

  private async getIndexColumnName(tableName: string): Promise<string[]> {
    if (tableName === TabeleNames.PRODUCTS) {
      return [ColumnNames.BARCODE, ColumnNames.NAME, ColumnNames.BRAND];
    } else if (tableName === TabeleNames.SELLERS) {
      return [ColumnNames.BRAND];
    } else {
      throw Error(`Unsupported table with name: '${tableName}'`);
    }
  }

  private async deleteTableData(tableName: string, mainColumnName: string) {
    try {
      const { error } = await this.supabase.from(tableName).delete().neq(mainColumnName, 0);

      if (error) {
        throw new Error(`Error deleting data from ${tableName}: ${error.message}`);
      }

      console.log(`Deleted all data from ${tableName}`);
    } catch (error) {
      console.error(`Error deleting data from ${tableName}: ${error}`);
    }
  }
}
