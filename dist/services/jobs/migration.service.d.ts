import { OnModuleInit } from '@nestjs/common';
import { MigrationLogService } from '../migration.log.service';
import { ProductService } from '../product.service';
export interface ICsvInfo {
    fileUrl: string;
    tableNames: string[];
}
export declare class MigrationService implements OnModuleInit {
    private readonly migrationLogService;
    private readonly productService;
    private readonly csvFilesInfo;
    constructor(migrationLogService: MigrationLogService, productService: ProductService);
    onModuleInit(): Promise<void>;
    runDailyMigration(): Promise<void>;
    private runMigration;
    private runMigrations;
}
