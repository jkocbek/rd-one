import { IUser } from '~modules/user/interfaces/user.interface';

export interface IPasswordForgot {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  expireAt: Date;
  user: IUser;
}
