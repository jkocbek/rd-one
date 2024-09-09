import { UserRole } from '../enums/user.role.enum';

export interface IUser {
  id: string;
  email: string;
  password?: string;
  roles: UserRole[];
}
