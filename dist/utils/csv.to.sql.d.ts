import { MigrationLogService } from 'src/services/migration.log.service';
import { ProductService } from 'src/services/product.service';
export interface MigrateToSQLDTO {
    fileUrl: string;
    tableName: string[];
}
export declare enum ColumnNames {
    BARCODE = "barcode",
    BRAND = "brand",
    NAME = "product_name"
}
export declare enum TabeleNames {
    PRODUCTS = "products",
    SELLERS = "sellers"
}
export declare class CSVtoSQLMigration {
    private readonly migrationLogService;
    private readonly productService;
    private supabase;
    private readonly batchSize;
    constructor(migrationLogService: MigrationLogService, productService: ProductService);
    migrateToSQL(migrationInfo: MigrateToSQLDTO): Promise<void>;
    private productsdHeaderMap;
    private sellersHeaderMap;
    private transformHeaders;
    private parseCSV;
    private insertIntoSupabaseInBatches;
    private getIndexColumnName;
    private deleteTableData;
}
