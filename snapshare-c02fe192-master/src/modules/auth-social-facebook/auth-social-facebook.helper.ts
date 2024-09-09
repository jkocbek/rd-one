import { IAuthManagedSocialProviderPublicCredentials } from '~vendors/auth-managed-social-provider/interfaces/auth-managed-social-provider.base.public-credentials.interface';

import { IAuthResponse } from '~modules/auth/interfaces/auth.response.interface';

import { IAuthSocialFacebookCredentials } from './interfaces/auth-social-facebook.credentials.interface';
import { IAuthSocialFacebook } from './interfaces/auth-social-facebook.interface';

export class AuthSocialFacebookHelper {
  static fromIAuthManagedSocialProviderPublicCredentials(
    data: IAuthManagedSocialProviderPublicCredentials,
  ): IAuthSocialFacebookCredentials {
    return {
      baseUrl: data.baseUrl,
      clientId: data.clientId,
      scopes: data.scopes,
      responseType: data.responseType,
    };
  }

  static fromIAuthResponse(authResponse: IAuthResponse): IAuthSocialFacebook {
    return {
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken,
    };
  }
}
