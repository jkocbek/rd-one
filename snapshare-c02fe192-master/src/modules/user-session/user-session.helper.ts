import { UserSession } from '@prisma/client';

import { IUserSession } from './interfaces/user-session.interface';

export class UserSessionHelper {
  static fromIUserSession(data: UserSession): IUserSession {
    return {
      id: data.id,
      jti: data.jti,
      createdAt: data.createdAt,
      expireAt: data.expireAt,
      userId: data.userId,
      userIdentityProviderId: data.userIdentityProviderId,
    };
  }
}
