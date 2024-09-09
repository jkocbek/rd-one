import { AuthExternalProviderIdentityName } from '../types/auth-external-provider.identity-name.type';

export interface IAuthExternalProviderUserInfoIdentity {
  userId?: string;
  identityName?: AuthExternalProviderIdentityName;
}
