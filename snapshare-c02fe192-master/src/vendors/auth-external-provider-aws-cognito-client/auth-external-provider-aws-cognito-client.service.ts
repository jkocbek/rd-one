import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { isUUID } from 'class-validator';
import * as jwt from 'jsonwebtoken';

import { AuthExternalProviderService } from '~vendors/auth-external-provider/auth-external-provider.service';
import { IAuthExternalProviderUserInfoIdentity } from '~vendors/auth-external-provider/interfaces/auth-external-provider.user-info.identity.interface';
import { IAuthExternalProviderUserInfo } from '~vendors/auth-external-provider/interfaces/auth-external-provider.user-info.interface';
import { AuthExternalProviderIdentityName } from '~vendors/auth-external-provider/types/auth-external-provider.identity-name.type';
import { AuthExternalProviderType } from '~vendors/auth-external-provider/types/auth-external-provider.type';
import { awsSdkCognitoClientIdentityProviderConstants } from '~vendors/aws-sdk-cognito-client-identity-provider/aws-sdk-cognito-client-identity-provider.constants';
import { AwsCognitoClientIdentityProviderService } from '~vendors/aws-sdk-cognito-client-identity-provider/aws-sdk-cognito-client-identity-provider.service';
import { OpenidClientService } from '~vendors/openid-client/openid-client.service';

import { AuthExternalProviderAwsCognitoClientConfig } from './auth-external-provider-aws-cognito-client.config';

@Injectable()
export class AuthExternalProviderAwsCognitoClientService extends AuthExternalProviderService {
  static readonly LOGGER_KEY = 'auth-external-provider-aws-cognito-client-logger';

  constructor(
    private readonly authExternalProviderAwsCognitoClientConfig: AuthExternalProviderAwsCognitoClientConfig,
    @Inject(AuthExternalProviderAwsCognitoClientService.LOGGER_KEY)
    protected readonly logger: Logger,
    private readonly openidClientService: OpenidClientService,
    private readonly awsCognitoClientIdentityProviderService: AwsCognitoClientIdentityProviderService,
  ) {
    super(logger);
  }

  async verifyToken(jwt: string): Promise<void> {
    await this.openidClientService.verify(jwt);
  }

  getProvider(): AuthExternalProviderType {
    return 'AWS_COGNITO';
  }

  async getUserInfo(accessToken: string): Promise<IAuthExternalProviderUserInfo> {
    const tokenPayload = jwt.decode(accessToken) as { scope: string };
    const { scope } = tokenPayload;

    if (!scope) {
      this.logger.error(`Cannot obtain 'scope' from access token payload.`);
      throw new InternalServerErrorException();
    }

    let result: IAuthExternalProviderUserInfo;
    const scopeSplit = scope.split(' ');
    const isIdentityProviderLogin = scopeSplit.find(
      (scopeValue) => scopeValue === awsSdkCognitoClientIdentityProviderConstants.scopes.signinUserAdmin,
    );

    if (isIdentityProviderLogin) {
      if (!this.authExternalProviderAwsCognitoClientConfig.allowSigninAdminUser) {
        this.logger.error(
          `ALLOW_SIGNIN_ADMIN_USER must be enabled when processing scope ${awsSdkCognitoClientIdentityProviderConstants.scopes.signinUserAdmin}`,
        );
        throw new InternalServerErrorException();
      }

      result = await this.getUserInfoAwsCognitoClientIdentityProvider(accessToken);
    } else {
      result = await this.getUserInfoAwsCognitoOpenid(accessToken);
    }

    return result;
  }

  getIdentity(input: string): IAuthExternalProviderUserInfoIdentity {
    const inputSplit = input.split('_');

    let identityName: AuthExternalProviderIdentityName | undefined;
    let userId: string | undefined;

    // if there is no "_" then it should be uuid (signaling AWS Cognito identity)
    if (inputSplit.length === 1) {
      const isCognitoIdentity = isUUID(input);
      if (!isCognitoIdentity) {
        this.logger.error(`Expected aws cognito identity, but input "${input}" is not uuid, which it should be.`);
        throw new InternalServerErrorException();
      }

      identityName = undefined;
      userId = input;
    }

    if (!identityName) {
      if (inputSplit.length === 2) {
        const stringifiedProvider = inputSplit[0];

        if (stringifiedProvider === 'google') {
          identityName = 'GOOGLE';
        }
        // those we dont handle get thrown as expection
        else {
          this.logger.error(
            `Error occurred trying to get aws cognito identity. Unknown external provider for input ${input}.`,
          );
          throw new InternalServerErrorException();
        }

        userId = inputSplit[1];
      }
    }

    if (!userId) {
      this.logger.error(`Error occurred trying to get aws cognito identity. Cannot obtain user id for input ${input}.`);
      throw new InternalServerErrorException();
    }

    return {
      identityName,
      userId,
    };
  }

  private async getUserInfoAwsCognitoOpenid(accessToken: string): Promise<IAuthExternalProviderUserInfo> {
    const userInfo = await this.openidClientService.getUserInfo(accessToken);

    const sub = userInfo.sub;
    if (!sub) {
      this.logger.error('Sub is missing from auth external provider aws cognito access token.');
      throw new InternalServerErrorException();
    }

    if (!userInfo.username) {
      this.logger.error(`Username is missing from auth external provider aws cognito access token with sub ${sub}.`);
      throw new InternalServerErrorException();
    }

    const email = userInfo.email;
    const emailVerified = userInfo.emailVerified;
    const invitationToken = userInfo.invitationToken;

    const identity = this.getIdentity(userInfo.username);

    return {
      sub,
      email,
      emailVerified,
      identity,
      invitationToken,
    };
  }

  private async getUserInfoAwsCognitoClientIdentityProvider(
    accessToken: string,
  ): Promise<IAuthExternalProviderUserInfo> {
    const cognitoUser = await this.awsCognitoClientIdentityProviderService.getUser(accessToken);
    const { attributes } = cognitoUser;

    const sub = attributes.get('sub');
    if (!sub) {
      this.logger.error(`"sub" is missing from 'auth-external-provider-aws-cognito-client' access token.`);
      throw new InternalServerErrorException();
    }

    const email = attributes.get('email');
    const emailVerifiedString = attributes.get('email_verified')?.toLowerCase();
    const emailVerified = emailVerifiedString === 'true';

    const username = cognitoUser.username ?? '';
    const identity = this.getIdentity(username);

    const invitationToken = attributes.get('custom:invitation_token');

    return {
      sub,
      email,
      emailVerified,
      identity,
      invitationToken,
    };
  }
}
