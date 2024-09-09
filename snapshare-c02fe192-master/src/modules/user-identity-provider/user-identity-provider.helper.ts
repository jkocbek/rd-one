import { User, UserIdentityProvider } from '@prisma/client';

import { UserHelper } from '~modules/user/user.helper';

import { UserIdentityProviderIntegration } from './enums/user-identity-provider.integration.enum';
import { UserIdentityProviderSource } from './enums/user-identity-provider.source.enum';
import { IUserIdentityProvider } from './interfaces/user-identity-provider.interface';

export class UserIdentityProviderHelper {
  static fromUserIdentityProvider(userIdentityProvider: UserIdentityProvider & { user: User }): IUserIdentityProvider {
    return {
      id: userIdentityProvider.id,
      sub: userIdentityProvider.sub,
      source: userIdentityProvider.source
        ? UserIdentityProviderHelper.parseUserIdentityProviderSource(userIdentityProvider.source)
        : undefined,
      integration: userIdentityProvider.integration
        ? UserIdentityProviderHelper.parseUserIdentityProviderIntegration(userIdentityProvider.integration)
        : undefined,
      emailVerified: userIdentityProvider.emailVerified,
      createdAt: userIdentityProvider.createdAt,
      updatedAt: userIdentityProvider.updatedAt,
      user: UserHelper.fromUser(userIdentityProvider.user),
    };
  }

  static parseUserIdentityProviderSource(stringValue: string): UserIdentityProviderSource {
    return UserIdentityProviderSource[
      stringValue as keyof typeof UserIdentityProviderSource
    ] as unknown as UserIdentityProviderSource;
  }

  static parseUserIdentityProviderIntegration(stringValue: string): UserIdentityProviderIntegration {
    return UserIdentityProviderIntegration[stringValue as keyof typeof UserIdentityProviderIntegration];
  }
}
