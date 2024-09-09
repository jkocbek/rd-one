import { Injectable } from '@nestjs/common';

import { IUserInvitation } from './interfaces/user-invitation.interface';
import { UserInvitationRepository } from './user-invitation.repository';

@Injectable()
export class UserInvitationService {
  constructor(private readonly userInvitationRepository: UserInvitationRepository) {}

  async findByUserId(userId: string): Promise<IUserInvitation | undefined> {
    const userInvitation = await this.userInvitationRepository.findByUserId(userId);
    return userInvitation;
  }

  async delete(id: string): Promise<void> {
    await this.userInvitationRepository.delete(id);
  }
}
