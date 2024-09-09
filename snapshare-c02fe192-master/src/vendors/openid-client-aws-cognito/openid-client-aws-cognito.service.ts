import { Inject, Injectable, Logger, NotImplementedException } from '@nestjs/common';

import { OpenidClientUserinfo } from '~vendors/openid-client/interfaces/openid-client.user-info.interface';
import { OpenidClientService } from '~vendors/openid-client/openid-client.service';

import { OpenidClientAwsCognitoUserInfo } from './interface/openid-client-aws-cognito.user-info.interface';
import { OpenidClientAwsCognitoConfig } from './openid-client-aws-cognito.config';

@Injectable()
export class OpenidClientAwsCognitoService extends OpenidClientService {
  static readonly LOGGER_KEY = 'openid-client-aws-cognito-service-logger';

  constructor(
    protected readonly openidClientAwsCognitoConfig: OpenidClientAwsCognitoConfig,
    @Inject(OpenidClientAwsCognitoService.LOGGER_KEY)
    protected readonly logger: Logger,
  ) {
    let baseIssuer: string | undefined;
    if (openidClientAwsCognitoConfig.region && openidClientAwsCognitoConfig.userPoolId) {
      baseIssuer = `https://cognito-idp.${openidClientAwsCognitoConfig.region}.amazonaws.com/${openidClientAwsCognitoConfig.userPoolId}`;
    }

    let issuer: string | undefined;
    let jwksEndpoint: string | undefined;
    if (baseIssuer) {
      issuer = `${baseIssuer}/.well-known/openid-configuration`;
      jwksEndpoint = `${baseIssuer}/.well-known/jwks.json`;
    }

    super(logger, ['token'], issuer, openidClientAwsCognitoConfig.clientId, jwksEndpoint);
  }

  async getUserInfo(accessToken: string): Promise<OpenidClientUserinfo> {
    if (!this.isSetup) {
      this.logger.error('Authentication is not setup. Cannot get user info.');
      throw new NotImplementedException('Authentication user info is not setup.');
    }

    const response = (await this.client.userinfo(accessToken)) as OpenidClientAwsCognitoUserInfo;

    const userinfo: OpenidClientUserinfo = {
      sub: response.sub,
      email: response.email ?? undefined,
      emailVerified: response.email_verified ? response.email_verified === 'true' : undefined,
      username: response.username,
      invitationToken: response['custom:invitation_token'] ? response['custom:invitation_token'] : undefined,
    };

    return userinfo;
  }
}
