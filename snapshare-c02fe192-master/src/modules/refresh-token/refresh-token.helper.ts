import { RefreshToken } from '@prisma/client';

import { IRefreshToken } from './interfaces/refresh-token.interface';

export class RefreshTokenHelper {
  static fromRefreshToken(model: RefreshToken): IRefreshToken {
    return {
      id: model.id,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      token: model.token,
      expireAt: model.expireAt,
      userId: model.userId,
      userSessionId: model.userSessionId,
    };
  }
}
