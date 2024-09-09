import { Logger, Module } from '@nestjs/common';

import { UserSessionController } from './user-session.controller';
import { UserSessionRepository } from './user-session.repository';
import { UserSessionService } from './user-session.service';

@Module({
  controllers: [UserSessionController],
  providers: [
    {
      provide: UserSessionService.LOGGER_KEY,
      useValue: new Logger(UserSessionService.name),
    },
    UserSessionRepository,
    UserSessionService,
  ],
  exports: [UserSessionService],
})
export class UserSessionModule {}
