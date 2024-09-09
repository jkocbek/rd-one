import { Logger, Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserService.LOGGER_KEY,
      useValue: new Logger(UserService.name),
    },
    UserRepository,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
