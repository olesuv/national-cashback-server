import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfigs } from './configs/env';
import { MigrationLog } from './models/migration.log.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { MigrationService } from './services/jobs/migration.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const envConfigs = new EnvConfigs();
        return {
          type: 'postgres',
          url: envConfigs.supabaseURL,
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: envConfigs.devMode,
        };
      },
    }),
    TypeOrmModule.forFeature([MigrationLog]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [MigrationService],
})
export class AppModule {}
