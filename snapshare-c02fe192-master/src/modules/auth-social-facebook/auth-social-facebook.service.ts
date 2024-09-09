import { Inject, Injectable, Logger } from '@nestjs/common';

import { InternalServerErrorException } from '~common/exceptions';

import { AuthManagedSocialProviderFacebookService } from '~vendors/auth-managed-social-provider-facebook/auth-managed-social-provider-facebook.service';
import { IAuthManagedSocialProviderUserEmail } from '~vendors/auth-managed-social-provider/interfaces/auth-managed-social-provider.user-email.interface';

import { AuthService } from '~modules/auth/auth.service';
import { UserIdentityProviderIntegration } from '~modules/user-identity-provider/enums/user-identity-provider.integration.enum';
import { UserIdentityProviderService } from '~modules/user-identity-provider/user-identity-provider.service';
import { UserService } from '~modules/user/user.service';
import { makeUUID } from '~utils/uuid';

import { AuthSocialFacebookHelper } from './auth-social-facebook.helper';
import { IAuthSocialFacebookCredentials } from './interfaces/auth-social-facebook.credentials.interface';
import { IAuthSocialFacebook } from './interfaces/auth-social-facebook.interface';

@Injectable()
export class AuthSocialFacebookService {
  static readonly LOGGER_KEY = 'auth-social-facebook-service-logger';

  constructor(
    @Inject(AuthSocialFacebookService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly authManagedSocialProviderFacebookService: AuthManagedSocialProviderFacebookService,
    private readonly userService: UserService,
    private readonly userIdentityProviderService: UserIdentityProviderService,
    private readonly authService: AuthService,
  ) {}

  async getAuthenticationCredentials(): Promise<IAuthSocialFacebookCredentials> {
    const credentials = await this.authManagedSocialProviderFacebookService.getAuthenticationCredentials();
    return AuthSocialFacebookHelper.fromIAuthManagedSocialProviderPublicCredentials(credentials);
  }

  async facebookLogin(code: string, redirectUri: string): Promise<IAuthSocialFacebook> {
    let accessToken: string | undefined;
    try {
      accessToken = await this.authManagedSocialProviderFacebookService.getAccessTokenUsingCode(code, redirectUri);
    } catch (err) {
      this.logger.warn(`Could not obtain access token for facebook sign-in. Error: `, err);
      throw new InternalServerErrorException(
        `Could not obtain access token for facebook sign-in.`,
        'AUTH_SOCIAL_FACEBOOK_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }

    if (!accessToken) {
      this.logger.warn(`Access token obtained for facebook sign-in is undefined.`);
      throw new InternalServerErrorException(
        `Could not obtain access token for facebook sign-in.`,
        'AUTH_SOCIAL_FACEBOOK_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }

    let userEmail: IAuthManagedSocialProviderUserEmail;
    try {
      userEmail = await this.authManagedSocialProviderFacebookService.getUserEmail(accessToken);
    } catch (err) {
      this.logger.warn(`Could not obtain user email for facebook sign-in.`);
      throw new InternalServerErrorException(
        `Could not obtain access token for facebook sign-in.`,
        'AUTH_SOCIAL_FACEBOOK_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }

    if (!userEmail.email) {
      this.logger.warn(`Could not obtain user email for facebook sign-in.`);
      throw new InternalServerErrorException(
        `Could not obtain access token for facebook sign-in.`,
        'AUTH_SOCIAL_FACEBOOK_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }
    if (!userEmail.sub) {
      this.logger.warn(`Could not obtain user sub for facebook sign-in.`);
      throw new InternalServerErrorException(
        `Could not obtain access token for facebook sign-in.`,
        'AUTH_SOCIAL_FACEBOOK_OBTAIN_ACCESS_TOKEN_FAILED',
      );
    }

    const { email, sub, emailVerified } = userEmail;

    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.create({ email });
    }

    let userIdentityProvider = await this.userIdentityProviderService.find({
      sub,
      integration: UserIdentityProviderIntegration.FACEBOOK,
    });
    if (!userIdentityProvider) {
      userIdentityProvider = await this.userIdentityProviderService.create({
        sub,
        integration: UserIdentityProviderIntegration.FACEBOOK,
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

    return AuthSocialFacebookHelper.fromIAuthResponse(authResponse);
  }
}
