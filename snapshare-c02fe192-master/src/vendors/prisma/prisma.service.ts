import { Injectable, OnModuleInit, LogLevel } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import QueryEvent = Prisma.QueryEvent;
import LogEvent = Prisma.LogEvent;
import { getConfig } from '~common/config';
import { logger } from '~common/logging';

import { DatabaseConfig } from '~database/database.config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');

const prismaConfig = getConfig(DatabaseConfig);

@Injectable()
export class PrismaService
  extends PrismaClient<{
    log: {
      emit: 'event';
      level: Prisma.LogLevel;
    }[];
    datasources: {
      db: {
        url: string;
      };
    };
  }>
  implements OnModuleInit
{
  constructor() {
    super({
      log: prismaConfig.log ? prismaConfig.log.map((level) => ({ emit: 'event', level })) : [],
      datasources: {
        db: {
          url: prismaConfig.databaseUrl,
        },
      },
    });

    if (prismaConfig.log) {
      for (const level of prismaConfig.log) {
        this.$on(level, (event) => {
          let severity: LogLevel = 'log';

          if (level === 'error') {
            severity = 'error';
          } else if (level === 'warn') {
            severity = 'warn';
          }

          const baseInfo: {
            context: string;
            severity: LogLevel;
          } = {
            context: 'PrismaORM',
            severity,
          };

          const baseExtra: Record<string, any> = {
            target: event.target,
            timestamp: event.timestamp,
          };

          if (this.eventIsQuery(event)) {
            logger.extra({
              ...baseInfo,
              extra: {
                query: event.query,
                params: event.params,
                duration: event.duration,
                ...baseExtra,
              },
            });
          } else {
            logger.extra({
              ...baseInfo,
              message: event.message,
              extra: baseExtra,
            });
          }
        });
      }
    }

    if (prismaConfig.runMigrations) {
      this.runMigrations();
    }
  }

  private runMigrations() {
    exec('yarn prisma:migrate', (error: any, stdout: any, stderr: any) => {
      if (error) {
        logger.log(error);
        return;
      }
      if (stderr) {
        logger.log(stderr);
        return;
      }
      logger.log(stdout);
    });
  }

  private eventIsQuery(event: QueryEvent | LogEvent): event is QueryEvent {
    // eslint-disable-next-line no-prototype-builtins
    return event.hasOwnProperty('query');
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  // todo: fix this
  // async enableShutdownHooks(app: INestApplication): Promise<void> {
  //   this.$on('beforeExit', async () => {
  //     await app.close();
  //   });
  // }
}
