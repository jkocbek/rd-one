import { Module } from '@nestjs/common';

import { UserInvitationRepository } from './user-invitation.repository';
import { UserInvitationService } from './user-invitation.service';

@Module({
  providers: [UserInvitationRepository, UserInvitationService],
  exports: [UserInvitationService],
})
export class UserInvitationModule {}
