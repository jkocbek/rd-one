import { Logger } from '@nestjs/common';

import { IAuthExternalProviderUserInfoIdentity } from './interfaces/auth-external-provider.user-info.identity.interface';
import { IAuthExternalProviderUserInfo } from './interfaces/auth-external-provider.user-info.interface';
import { AuthExternalProviderType } from './types/auth-external-provider.type';

export abstract class AuthExternalProviderService {
  constructor(protected readonly logger: Logger) {}

  abstract verifyToken(jwt: string): Promise<void>;
  abstract getProvider(): AuthExternalProviderType;
  abstract getUserInfo(accessToken: string): Promise<IAuthExternalProviderUserInfo>;
  abstract getIdentity(input: string): IAuthExternalProviderUserInfoIdentity;
}
