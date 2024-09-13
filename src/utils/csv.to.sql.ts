import { createClient } from '@supabase/supabase-js';
import { parse } from 'fast-csv';
import { Readable } from 'stream';
import axios from 'axios';

export interface IMigrateToSQLDTO {
  fileUrl: string;
  tableName: string;
}

export class CSVtoSQLMigration {
  private supabase: any;
  private readonly batchSize: number = 1000;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string,
    );
  }

  public async migrateToSQL(migrationInfo: IMigrateToSQLDTO) {
    try {
      const data = await this.parseCSV(migrationInfo.fileUrl);

      const transformedData = this.transformHeaders(data);

      await this.insertIntoSupabaseInBatches(
        transformedData,
        migrationInfo.tableName,
        this.batchSize,
      );
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

  private transformHeaders(data: any[]): any[] {
    return data.map((row) => {
      const transformedRow: any = {};

      Object.keys(row).forEach((key) => {
        const newKey = this.productsdHeaderMap[key] || key;
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
