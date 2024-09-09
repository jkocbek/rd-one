import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { AuthExternalProviderService } from '~vendors/auth-external-provider/auth-external-provider.service';
import { IAuthExternalProviderUserInfoIdentity } from '~vendors/auth-external-provider/interfaces/auth-external-provider.user-info.identity.interface';
import { IAuthExternalProviderUserInfo } from '~vendors/auth-external-provider/interfaces/auth-external-provider.user-info.interface';
import { AuthExternalProviderIdentityName } from '~vendors/auth-external-provider/types/auth-external-provider.identity-name.type';
import { AuthExternalProviderType } from '~vendors/auth-external-provider/types/auth-external-provider.type';
import { OpenidClientService } from '~vendors/openid-client/openid-client.service';

@Injectable()
export class AuthExternalProviderAuth0ClientService extends AuthExternalProviderService {
  static readonly LOGGER_KEY = 'auth-external-provider-auth0-client-logger';

  constructor(
    @Inject(AuthExternalProviderAuth0ClientService.LOGGER_KEY)
    protected readonly logger: Logger,
    private readonly openidClientService: OpenidClientService,
  ) {
    super(logger);
  }

  async verifyToken(jwt: string): Promise<void> {
    await this.openidClientService.verify(jwt);
  }

  getProvider(): AuthExternalProviderType {
    return 'AUTH0';
  }

  async getUserInfo(accessToken: string): Promise<IAuthExternalProviderUserInfo> {
    const userInfo = await this.openidClientService.getUserInfo(accessToken);

    const sub = userInfo.sub;
    if (!sub) {
      throw new InternalServerErrorException('"sub" is missing from auth external provider auth0 access token.');
    }

    const email = userInfo.email;
    const emailVerified = userInfo.emailVerified ?? false;

    const identity = this.getIdentity(userInfo.sub);

    return {
      sub,
      email,
      emailVerified,
      identity,
    };
  }

  getIdentity(input: string): IAuthExternalProviderUserInfoIdentity {
    const inputSplit = input.split('|');

    if (inputSplit.length !== 2) {
      this.logger.error(`Error occurred splitting input ${input}. Expected length of 2 after splitting by '|'.`);
      throw new InternalServerErrorException();
    }

    let identityName: AuthExternalProviderIdentityName | undefined;
    const stringifiedProvider = inputSplit[0];

    // auth0
    if (stringifiedProvider === 'auth0') {
      identityName = undefined;
    }
    // google
    else if (stringifiedProvider === 'google-oauth2') {
      identityName = 'GOOGLE';
    }
    // those we dont handle get thrown as expection
    else {
      this.logger.error(`Error occurred trying to get auth0 identity. Unknown external provider for input ${input}.`);
      throw new InternalServerErrorException();
    }

    const userId = inputSplit[1];

    return {
      identityName,
      userId,
    };
  }
}
