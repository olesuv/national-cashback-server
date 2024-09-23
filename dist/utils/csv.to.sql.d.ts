import { MigrationLogService } from 'src/services/migration.log.service';
import { ProductService } from 'src/services/product.service';
import { MigrateToSQLDTO } from 'src/constants/csv.to.sql';
export declare class CSVtoSQLMigration {
    private readonly migrationLogService;
    private readonly productService;
    private supabase;
    private readonly batchSize;
    constructor(migrationLogService: MigrationLogService, productService: ProductService);
    migrateToSQL(migrationInfo: MigrateToSQLDTO): Promise<void>;
    private transformHeaders;
    private parseCSV;
    private insertIntoSupabaseInBatches;
    private getIndexColumnName;
    private deleteTableData;
}
