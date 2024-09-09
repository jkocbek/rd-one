import { Injectable } from '@nestjs/common';

import { PrismaService } from '~vendors/prisma/prisma.service';

import { IUserInvitation } from './interfaces/user-invitation.interface';
import { UserInvitationHelper } from './user-invitation.helper';

@Injectable()
export class UserInvitationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: string): Promise<IUserInvitation | undefined> {
    const userInvitation = await this.prismaService.userInvitation.findUnique({
      where: { userId },
    });

    if (!userInvitation) {
      return undefined;
    }

    return UserInvitationHelper.fromUserInvitation(userInvitation);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.userInvitation.delete({
      where: { id },
    });
  }
}
