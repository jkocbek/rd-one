import { Logger, Module } from '@nestjs/common';

import { PushNotificationTokenController } from './push-notification-token.controller';
import { PushNotificationTokenRepository } from './push-notification-token.repository';
import { PushNotificationTokenService } from './push-notification-token.service';

@Module({
  controllers: [PushNotificationTokenController],
  providers: [
    {
      provide: PushNotificationTokenService.LOGGER_KEY,
      useValue: new Logger(PushNotificationTokenService.name),
    },
    PushNotificationTokenRepository,
    PushNotificationTokenService,
  ],
  exports: [PushNotificationTokenService],
})
export class PushNotificationTokenModule {}
