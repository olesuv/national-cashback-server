import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { MIGRATION_REQ_TIMEOUT } from 'src/constants/api/utils';
import { MigrationService } from 'src/services/jobs/migration.service';
import { TimeoutInterceptor } from 'src/utils/timeout.interceptor';

@Controller()
export class AppController {
  constructor(private readonly csvToSqlService: MigrationService) {}

  @Get()
  @UseInterceptors(new TimeoutInterceptor(MIGRATION_REQ_TIMEOUT))
  async getHello() {
    // setted up mainly for vercel cron job
    await this.csvToSqlService.runDailyMigration();
    return 'wassup from national cashback server';
  }
}
