import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MigrationLog } from 'src/models/migration.log.entity';
import { Repository } from 'typeorm';

interface IMigrationLogDTO {
  tableName: string;
}

@Injectable()
export class MigrationLogService {
  constructor(
    @InjectRepository(MigrationLog)
    private readonly migrationLogRepo: Repository<MigrationLog>,
  ) {}

  async createMigrationLog(createMigrationLog: IMigrationLogDTO): Promise<MigrationLog> {
    const existingLog = await this.findByTableName(createMigrationLog);

    if (existingLog) {
      return await this.updateMigrationLog(createMigrationLog);
    }

    const newMigrationLog = this.migrationLogRepo.create({
      tableName: createMigrationLog.tableName,
    });

    return await this.migrationLogRepo.save(newMigrationLog);
  }

  async updateMigrationLog(migrationLog: IMigrationLogDTO): Promise<MigrationLog> {
    const existingLog = await this.findByTableName(migrationLog);

    existingLog.updatedAt = new Date();
    return await this.migrationLogRepo.save(existingLog);
  }

  async findByTableName(migrationLog: IMigrationLogDTO): Promise<MigrationLog | null> {
    const findMigrationLog = await this.migrationLogRepo.findOne({
      where: { tableName: migrationLog.tableName },
    });

    return findMigrationLog;
  }
}
