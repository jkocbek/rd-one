import { Logger, Module } from '@nestjs/common';

import { UserModule } from '~modules/user/user.module';

import { UserMeController } from './user-me.controller';
import { UserMeService } from './user-me.service';

@Module({
  imports: [UserModule],
  controllers: [UserMeController],
  providers: [
    {
      provide: UserMeService.LOGGER_KEY,
      useValue: new Logger(UserMeService.name),
    },
    UserMeService,
  ],
  exports: [UserMeService],
})
export class UserMeModule {}
