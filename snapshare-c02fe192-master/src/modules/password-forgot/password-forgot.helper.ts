import { PasswordForgot, User } from '@prisma/client';

import { UserHelper } from '~modules/user/user.helper';

import { IPasswordForgot } from './interfaces/password-forgot.interface';

export class PasswordForgotHelper {
  static fromPasswordForgot(model: PasswordForgot & { user: User }): IPasswordForgot {
    const user = UserHelper.fromUser(model.user);

    return {
      id: model.id,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      code: model.code,
      expireAt: model.expireAt,
      user,
    };
  }
}
