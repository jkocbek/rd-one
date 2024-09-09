import { Logger, Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';

@Module({
  controllers: [UserManagementController],
  providers: [
    UserManagementService,
    {
      provide: UserManagementService.LOGGER_KEY,
      useValue: new Logger(UserManagementService.name),
    },
  ],
  exports: [UserManagementService],
})
export class UserManagementModule {}
