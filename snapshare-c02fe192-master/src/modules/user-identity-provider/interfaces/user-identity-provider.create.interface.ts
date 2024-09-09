import { UserIdentityProviderIntegration } from '../enums/user-identity-provider.integration.enum';
import { UserIdentityProviderSource } from '../enums/user-identity-provider.source.enum';

export interface IUserIdentityProviderCreate {
  sub: string;
  source?: UserIdentityProviderSource;
  integration?: UserIdentityProviderIntegration;
  emailVerified?: boolean;
  userId: string;
}
