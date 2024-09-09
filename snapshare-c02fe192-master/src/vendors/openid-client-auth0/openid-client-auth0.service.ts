import { Inject, Injectable, Logger, NotImplementedException } from '@nestjs/common';

import { OpenidClientUserinfo } from '~vendors/openid-client/interfaces/openid-client.user-info.interface';
import { OpenidClientService } from '~vendors/openid-client/openid-client.service';

import { OpenidClientAuth0UserInfo } from './interfaces/openid-client-auth0.user-info.interface';
import { OpenidClientAuth0Config } from './openid-client-auth0.config';

@Injectable()
export class OpenidClientAuth0Service extends OpenidClientService {
  static readonly LOGGER_KEY = 'openid-client-auth0-service-logger';

  constructor(
    protected readonly openidClientAuth0Config: OpenidClientAuth0Config,
    @Inject(OpenidClientAuth0Service.LOGGER_KEY)
    protected readonly logger: Logger,
  ) {
    const issuer = `https://${openidClientAuth0Config.domain}/.well-known/openid-configuration`;
    const jwksEndpoint = `https://${openidClientAuth0Config.domain}/.well-known/jwks.json`;

    super(logger, ['token'], issuer, openidClientAuth0Config.clientId, jwksEndpoint);
  }

  async getUserInfo(accessToken: string): Promise<OpenidClientUserinfo> {
    if (!this.isSetup) {
      this.logger.error('Authentication is not setup. Cannot get user info.');
      throw new NotImplementedException('Authentication user info is not setup.');
    }

    const response = (await this.client.userinfo(accessToken)) as OpenidClientAuth0UserInfo;

    const userinfo: OpenidClientUserinfo = {
      sub: response.sub,
      email: response.email,
      emailVerified: response.email_verified,
      invitationToken: response.invitation_token,
    };

    return userinfo;
  }
}
