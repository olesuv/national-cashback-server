import { MigrationService } from 'src/services/jobs/migration.service';
export declare class AppController {
    private readonly csvToSqlService;
    constructor(csvToSqlService: MigrationService);
    getHello(): Promise<string>;
}
