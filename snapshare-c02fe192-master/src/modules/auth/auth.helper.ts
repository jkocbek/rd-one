import { IAuthManagedCustomProviderAccessTokenPayload } from '~vendors/auth-managed-custom-provider/interfaces/auth-managed-custom-provider.access-token.payload.interface';

import { IAuthAccessToken } from './interfaces/auth.access-token.interface';

export class AuthHelper {
  static fromIAuthManagedCustomProviderAccessTokenPayload(
    data: IAuthManagedCustomProviderAccessTokenPayload,
  ): IAuthAccessToken {
    return {
      sub: data.sub,
      jti: data.jti,
    };
  }
}
