import { PushNotificationToken } from '@prisma/client';

import { IPushNotificationToken } from './interfaces/push-notification-token.interface';

export class PushNotificationTokenHelper {
  static fromPushNotificationToken(pushNotificationToken: PushNotificationToken): IPushNotificationToken {
    return {
      id: pushNotificationToken.id,
      createdAt: pushNotificationToken.createdAt,
      updatedAt: pushNotificationToken.updatedAt,
      token: pushNotificationToken.token,
      userId: pushNotificationToken.userId,
    };
  }
}
