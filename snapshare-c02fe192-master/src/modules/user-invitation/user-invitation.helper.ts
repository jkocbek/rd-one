import { UserInvitation } from '@prisma/client';

import { IUserInvitation } from './interfaces/user-invitation.interface';

export class UserInvitationHelper {
  static fromUserInvitation(userInvitation: UserInvitation): IUserInvitation {
    return {
      id: userInvitation.id,
      createdAt: userInvitation.createdAt,
      updatedAt: userInvitation.updatedAt,
      expireAt: userInvitation.expireAt,
      token: userInvitation.token,
      userId: userInvitation.userId,
    };
  }
}
