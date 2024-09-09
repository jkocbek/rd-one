import { IAuthManagedSocialProviderPublicCredentials } from '~vendors/auth-managed-social-provider/interfaces/auth-managed-social-provider.base.public-credentials.interface';

import { IAuthResponse } from '~modules/auth/interfaces/auth.response.interface';

import { IAuthSocialGoogleCredentials } from './interfaces/auth-social-google.credentials.interface';
import { IAuthSocialGoogle } from './interfaces/auth-social-google.interface';

export class AuthSocialGoogleHelper {
  static fromIAuthManagedSocialProviderPublicCredentials(
    data: IAuthManagedSocialProviderPublicCredentials,
  ): IAuthSocialGoogleCredentials {
    return {
      baseUrl: data.baseUrl,
      clientId: data.clientId,
      scopes: data.scopes,
      responseType: data.responseType,
    };
  }

  static fromIAuthResponse(authResponse: IAuthResponse): IAuthSocialGoogle {
    return {
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken,
    };
  }
}
