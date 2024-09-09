import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { AuthManagedSocialProviderService } from '~vendors/auth-managed-social-provider/auth-managed-social-provider.service';
import { IAuthManagedSocialProviderPublicCredentials } from '~vendors/auth-managed-social-provider/interfaces/auth-managed-social-provider.base.public-credentials.interface';
import { IAuthManagedSocialProviderUserEmail } from '~vendors/auth-managed-social-provider/interfaces/auth-managed-social-provider.user-email.interface';

import { AuthManagedSocialProviderGoogleConfig } from './auth-managed-social-provider-google.config';
import { authManagedSocialProviderGoogleConstants } from './auth-managed-social-provider-google.constants';

@Injectable()
export class AuthManagedSocialProviderGoogleService extends AuthManagedSocialProviderService {
  constructor(private readonly authManagedSocialProviderGoogleConfig: AuthManagedSocialProviderGoogleConfig) {
    super();
  }

  async getAuthenticationCredentials(): Promise<IAuthManagedSocialProviderPublicCredentials> {
    const { clientId, scopes, responseType } = this.authManagedSocialProviderGoogleConfig;

    return {
      baseUrl: authManagedSocialProviderGoogleConstants.baseUrl,
      clientId,
      scopes,
      responseType,
    };
  }

  async getAccessTokenUsingCode(code: string, redirectUri: string): Promise<string | undefined> {
    const client = this.createOAuth2Client(redirectUri);
    const { tokens } = await client.getToken(code);
    const { access_token: accessToken } = tokens;

    return accessToken ?? undefined;
  }

  async getUserEmail(accessToken: string): Promise<IAuthManagedSocialProviderUserEmail> {
    const client = this.createOAuth2Client();
    client.setCredentials({
      access_token: accessToken,
    });

    const tokenInfo = await client.getTokenInfo(accessToken);

    let emailVerified: boolean | undefined;

    const tokenInfoEmailVerified = tokenInfo.email_verified;
    if (tokenInfoEmailVerified) {
      if (typeof tokenInfoEmailVerified === 'string') {
        emailVerified = (tokenInfoEmailVerified as string).trim().toLowerCase() === 'true' ? true : false;
      } else if (typeof tokenInfoEmailVerified === 'boolean') {
        emailVerified = tokenInfoEmailVerified;
      }
    }

    return {
      sub: tokenInfo.sub,
      email: tokenInfo.email,
      emailVerified,
    };
  }

  private createOAuth2Client(redirectUri?: string): OAuth2Client {
    const { clientId, clientSecret } = this.authManagedSocialProviderGoogleConfig;

    const client = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri,
    });

    return client;
  }
}
