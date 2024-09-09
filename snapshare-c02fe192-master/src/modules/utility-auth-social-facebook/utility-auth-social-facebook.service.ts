import { Injectable } from '@nestjs/common';

import { AuthSocialFacebookService } from '~modules/auth-social-facebook/auth-social-facebook.service';

import { UtilityAuthSocialFacebookConfig } from './utility-auth-social-facebook.config';

@Injectable()
export class UtilityAuthSocialFacebookService {
  constructor(
    private readonly utilityAuthSocialFacebookConfig: UtilityAuthSocialFacebookConfig,
    private readonly authSocialFacebookService: AuthSocialFacebookService,
  ) {}

  async generateAuthenticationUrl(): Promise<string> {
    const credentials = await this.authSocialFacebookService.getAuthenticationCredentials();

    const queryKeys: [key: string, value: string][] = [
      ['client_id', credentials.clientId],
      ['scope', credentials.scopes.join(' ')],
      ['response_type', credentials.responseType],
      ['redirect_uri', this.utilityAuthSocialFacebookConfig.frontendUrl],
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
