import { IUser } from '~modules/user/interfaces/user.interface';

import { IUserMe } from './interfaces/user-me.interface';

export class UserMeHelper {
  static fromIUser(data: IUser): IUserMe {
    return {
      id: data.id,
      email: data.email,
    };
  }
}
