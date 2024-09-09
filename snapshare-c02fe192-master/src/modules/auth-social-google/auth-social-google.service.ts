import { Inject, Injectable, Logger } from '@nestjs/common';

import { InternalServerErrorException } from '~common/exceptions';

import { AuthManagedSocialProviderGoogleService } from '~vendors/auth-managed-social-provider-google/auth-managed-social-provider-google.service';
import { IAuthManagedSocialProviderUserEmail } from '~vendors/auth-managed-social-provider/interfaces/auth-managed-social-provider.user-email.interface';

import { AuthService } from '~modules/auth/auth.service';
import { UserIdentityProviderIntegration } from '~modules/user-identity-provider/enums/user-identity-provider.integration.enum';
import { UserIdentityProviderService } from '~modules/user-identity-provider/user-identity-provider.service';
import { UserService } from '~modules/user/user.service';
import { makeUUID } from '~utils/uuid';

import { AuthSocialGoogleHelper } from './auth-social-google.helper';
import { IAuthSocialGoogleCredentials } from './interfaces/auth-social-google.credentials.interface';
import { IAuthSocialGoogle } from './interfaces/auth-social-google.interface';

@Injectable()
export class AuthSocialGoogleService {
  static readonly LOGGER_KEY = 'auth-social-google-service-logger';

  constructor(
    @Inject(AuthSocialGoogleService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly authManagedSocialProviderGoogleService: AuthManagedSocialProviderGoogleService,
    private readonly userService: UserService,
    private readonly userIdentityProviderService: UserIdentityProviderService,
    private readonly authService: AuthService,
  ) {}

  async getAuthenticationCredentials(): Promise<IAuthSocialGoogleCredentials> {
    const credentials = await this.authManagedSocialProviderGoogleService.getAuthenticationCredentials();
    return AuthSocialGoogleHelper.fromIAuthManagedSocialProviderPublicCredentials(credentials);
  }

  async googleLogin(code: string, redirectUri: string): Promise<IAuthSocialGoogle> {
    let accessToken: string | undefined;
    try {
      accessToken = await this.authManagedSocialProviderGoogleService.getAccessTokenUsingCode(code, redirectUri);
    } catch (err) {
      this.logger.warn(`Could not obtain access token for google-sign in. Error: `, err);
      throw new InternalServerErrorException(
        `Could not obtain access token for google sign-in.`,
        'AUTH_SOCIAL_GOOGLE_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }

    if (!accessToken) {
      this.logger.warn(`Access token obtained for google sign-in is undefined.`);
      throw new InternalServerErrorException(
        `Could not obtain access token for google sign-in.`,
        'AUTH_SOCIAL_GOOGLE_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }

    let userEmail: IAuthManagedSocialProviderUserEmail;
    try {
      userEmail = await this.authManagedSocialProviderGoogleService.getUserEmail(accessToken);
    } catch (err) {
      this.logger.warn(`Could not obtain user email for google sign-in.`);
      throw new InternalServerErrorException(
        `Could not obtain access token for google sign-in.`,
        'AUTH_SOCIAL_GOOGLE_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }

    if (!userEmail.email) {
      this.logger.warn(`Could not obtain user email for google sign-in.`);
      throw new InternalServerErrorException(
        `Could not obtain access token for google sign-in.`,
        'AUTH_SOCIAL_GOOGLE_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }
    if (!userEmail.sub) {
      this.logger.warn(`Could not obtain user sub for google sign-in.`);
      throw new InternalServerErrorException(
        `Could not obtain access token for google sign-in.`,
        'AUTH_SOCIAL_GOOGLE_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }

    const { email, sub, emailVerified } = userEmail;

    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.create({ email });
    }

    let userIdentityProvider = await this.userIdentityProviderService.find({
      sub,
      integration: UserIdentityProviderIntegration.GOOGLE,
    });
    if (!userIdentityProvider) {
      userIdentityProvider = await this.userIdentityProviderService.create({
        sub,
        integration: UserIdentityProviderIntegration.GOOGLE,
        source: undefined,
        emailVerified,
        userId: user.id,
      });
    } else {
      if (emailVerified && !userIdentityProvider.emailVerified) {
        await this.userIdentityProviderService.update(userIdentityProvider.id, {
          emailVerified,
        });
      }
    }

    const jti = makeUUID();
    const authResponse = await this.authService.createAuthSession(user.id, userIdentityProvider.id, jti);

    return AuthSocialGoogleHelper.fromIAuthResponse(authResponse);
  }
}
