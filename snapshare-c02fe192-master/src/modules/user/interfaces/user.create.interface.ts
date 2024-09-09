import { UserRole } from '../enums/user.role.enum';

export interface IUserCreate {
  email: string;
  password?: string;
  roles?: UserRole[];
}
