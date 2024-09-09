import { UserRole } from '~modules/user/enums/user.role.enum';

export interface IVerifiedUser {
  id: string;
  email: string;
  roles: UserRole[];
  emailVerified: boolean;
}
