import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { AuthManagedSocialProviderService } from '~vendors/auth-managed-social-provider/auth-managed-social-provider.service';
import { IAuthManagedSocialProviderPublicCredentials } from '~vendors/auth-managed-social-provider/interfaces/auth-managed-social-provider.base.public-credentials.interface';
import { IAuthManagedSocialProviderUserEmail } from '~vendors/auth-managed-social-provider/interfaces/auth-managed-social-provider.user-email.interface';

import { AuthManagedSocialProviderFacebookConfig } from './auth-managed-social-provider-facebook.config';
import { IAuthManagedSocialProviderFacebookAccessTokenResponse } from './interfaces/auth-managed-social-provider-facebook.access-token.response.interface';
import { IAuthManagedSocialProviderFacebookUserInfoResponse } from './interfaces/auth-managed-social-provider-facebook.user-info.response.interface';

@Injectable()
export class AuthManagedSocialProviderFacebookService extends AuthManagedSocialProviderService {
  constructor(private readonly authManagedSocialProviderFacebookConfig: AuthManagedSocialProviderFacebookConfig) {
    super();
  }

  private get baseAuthUrl(): string {
    const { version } = this.authManagedSocialProviderFacebookConfig;
    return `https://www.facebook.com/${version}`;
  }

  private get baseGraphUrl(): string {
    const { version } = this.authManagedSocialProviderFacebookConfig;
    return `https://graph.facebook.com/${version}`;
  }

  async getAuthenticationCredentials(): Promise<IAuthManagedSocialProviderPublicCredentials> {
    const { appId, scopes, responseType } = this.authManagedSocialProviderFacebookConfig;

    return {
      baseUrl: `${this.baseAuthUrl}/dialog/oauth`,
      clientId: appId,
      scopes,
      responseType,
    };
  }

  async getAccessTokenUsingCode(code: string, redirectUri: string): Promise<string | undefined> {
    const { appId, appSecret } = this.authManagedSocialProviderFacebookConfig;

    const response = await axios.get(`${this.baseGraphUrl}/oauth/access_token`, {
      params: {
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code,
      },
    });

    const data = response.data as IAuthManagedSocialProviderFacebookAccessTokenResponse;

    return data.access_token;
  }

  async getUserEmail(accessToken: string): Promise<IAuthManagedSocialProviderUserEmail> {
    const { userInfoFields } = this.authManagedSocialProviderFacebookConfig;
    const fieldsString = userInfoFields.join(',');

    const response = await axios.get(`${this.baseGraphUrl}/me`, {
      params: {
        fields: fieldsString,
        access_token: accessToken,
      },
    });

    const data = response.data as IAuthManagedSocialProviderFacebookUserInfoResponse;

    return {
      sub: data.id,
      email: data.email,
    };
  }
}
