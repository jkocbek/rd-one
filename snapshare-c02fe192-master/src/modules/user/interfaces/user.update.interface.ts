import { UserRole } from '../enums/user.role.enum';

export interface IUserUpdate {
  email?: string;
  password?: string;
  roles?: UserRole[];
}
