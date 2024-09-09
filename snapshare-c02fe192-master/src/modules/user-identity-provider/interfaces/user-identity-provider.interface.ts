import { IUser } from '~modules/user/interfaces/user.interface';

import { UserIdentityProviderIntegration } from '../enums/user-identity-provider.integration.enum';
import { UserIdentityProviderSource } from '../enums/user-identity-provider.source.enum';

export interface IUserIdentityProvider {
  id: string;
  sub: string;
  createdAt: Date;
  updatedAt: Date;
  source?: UserIdentityProviderSource;
  integration?: UserIdentityProviderIntegration;
  emailVerified: boolean;
  user: IUser;
}
