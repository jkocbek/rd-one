import { UserIdentityProviderIntegration } from '../enums/user-identity-provider.integration.enum';
import { UserIdentityProviderSource } from '../enums/user-identity-provider.source.enum';

export interface IUserIdentityProviderUpdate {
  sub?: string;
  source?: UserIdentityProviderSource | null;
  integration?: UserIdentityProviderIntegration | null;
  emailVerified?: boolean;
  userId?: string;
}
