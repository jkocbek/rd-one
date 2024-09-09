import { IAuthExternalProviderUserInfoIdentity } from './auth-external-provider.user-info.identity.interface';

export interface IAuthExternalProviderUserInfo {
  sub: string;
  email?: string;
  emailVerified?: boolean;
  identity: IAuthExternalProviderUserInfoIdentity;
  invitationToken?: string;
}
