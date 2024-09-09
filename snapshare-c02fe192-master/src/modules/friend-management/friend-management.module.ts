import { Logger, Module } from '@nestjs/common';
import { FriendManagementService } from './friend-management.service';
import { FriendPrismaRepository } from './friend.prisma-repository';
import { FriendManagementController } from './friend-management.controller';

@Module({
  controllers: [FriendManagementController],
  providers: [
    FriendManagementService,
    {
      provide: FriendManagementService.LOGGER_KEY,
      useValue: new Logger(FriendManagementService.name),
    },
    {
      provide: 'FriendRequestRepository',
      useClass: FriendPrismaRepository,
    },
    {
      provide: 'FriendRepository',
      useClass: FriendPrismaRepository,
    },
  ],
  exports: [FriendManagementService],
})
export class FriendManagementModule {}
