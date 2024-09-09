import { Injectable } from '@nestjs/common';

import { AuthSocialGoogleService } from '~modules/auth-social-google/auth-social-google.service';

import { UtilityAuthSocialGoogleConfig } from './utility-auth-social-google.config';

@Injectable()
export class UtilityAuthSocialGoogleService {
  constructor(
    private readonly utilityAuthSocialGoogleConfig: UtilityAuthSocialGoogleConfig,
    private readonly authSocialGoogleService: AuthSocialGoogleService,
  ) {}

  async generateAuthenticationUrl(): Promise<string> {
    const credentials = await this.authSocialGoogleService.getAuthenticationCredentials();

    const queryKeys: [key: string, value: string][] = [
      ['client_id', credentials.clientId],
      ['scope', credentials.scopes.join(' ')],
      ['response_type', credentials.responseType],
      ['redirect_uri', this.utilityAuthSocialGoogleConfig.frontendUrl],
    ];

    const queryKeysEncoded = queryKeys.map((queryKey) => {
      const key = queryKey[0];
      const val = queryKey[1];

      return `${key}=${encodeURIComponent(val)}`;
    });

    const query = queryKeysEncoded.join('&');

    const url = credentials.baseUrl + '?' + query;

    return url;
  }
}
