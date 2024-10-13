import { Injectable, NotFoundException } from '@nestjs/common';
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
    private migrationLogRepo: Repository<MigrationLog>,
  ) {}

  async createMigrationLog(createMigrationLog: IMigrationLogDTO): Promise<MigrationLog> {
    const mbCreated = await this.findByTableName(createMigrationLog);
    if (mbCreated) {
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

  async findByTableName(migrationLog: IMigrationLogDTO): Promise<MigrationLog> {
    const findMigrationLog = await this.migrationLogRepo.findOne({
      where: { tableName: migrationLog.tableName },
    });

    if (!findMigrationLog) {
      throw new NotFoundException(`Migration log for file ${migrationLog.tableName} not found`);
    }

    return findMigrationLog;
  }
}
