import { MigrationLog } from 'src/models/migration.log.entity';
import { Repository } from 'typeorm';
interface IMigrationLogDTO {
    tableName: string;
}
export declare class MigrationLogService {
    private migrationLogRepo;
    constructor(migrationLogRepo: Repository<MigrationLog>);
    createMigrationLog(createMigrationLog: IMigrationLogDTO): Promise<MigrationLog>;
    updateMigrationLog(migrationLog: IMigrationLogDTO): Promise<MigrationLog>;
    findByTableName(migrationLog: IMigrationLogDTO): Promise<MigrationLog>;
}
export {};
