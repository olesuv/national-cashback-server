import { MigrationLog } from 'src/models/migration.log.entity';
import { Repository } from 'typeorm';
interface IMigrationLogDTO {
    tableName: string;
}
export declare class MigrationLogService {
    private readonly migrationLogRepo;
    constructor(migrationLogRepo: Repository<MigrationLog>);
    createMigrationLog(createMigrationLog: IMigrationLogDTO): Promise<MigrationLog>;
    updateMigrationLog(migrationLog: IMigrationLogDTO): Promise<MigrationLog>;
    findByTableName(migrationLog: IMigrationLogDTO): Promise<MigrationLog | null>;
}
export {};
