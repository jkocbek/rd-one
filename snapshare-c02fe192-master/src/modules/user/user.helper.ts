import { User } from '@prisma/client';

import { UserRole } from './enums/user.role.enum';
import { IUser } from './interfaces/user.interface';

export class UserHelper {
  static fromUser(model: User): IUser {
    return {
      id: model.id,
      email: model.email,
      password: model.password ?? undefined,
      roles: model.roles.map((role) => UserHelper.parseUserRole(role)),
    };
  }

  static parseUserRole(stringValue: string): UserRole {
    return UserRole[stringValue as keyof typeof UserRole];
  }
}
