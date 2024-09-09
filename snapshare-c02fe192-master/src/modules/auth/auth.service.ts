import { Inject, Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';

import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '~common/exceptions';

import { AuthManagedCustomProviderEmailPasswordService } from '~vendors/auth-managed-custom-provider-email-password/auth-managed-custom-provider-email-password.service';
import { IAuthManagedCustomProviderAccessTokenPayload } from '~vendors/auth-managed-custom-provider/interfaces/auth-managed-custom-provider.access-token.payload.interface';
import { IAuthManagedCustomProviderRefreshTokenPayload } from '~vendors/auth-managed-custom-provider/interfaces/auth-managed-custom-provider.refresh-token.payload.interface';

import { RefreshTokenService } from '~modules/refresh-token/refresh-token.service';
import { UserIdentityProviderService } from '~modules/user-identity-provider/user-identity-provider.service';
import { UserSessionService } from '~modules/user-session/user-session.service';
import { UserService } from '~modules/user/user.service';
import { makeUUID } from '~utils/uuid';

import { AuthConfig } from './auth.config';
import { AuthHelper } from './auth.helper';
import { IAuthAccessToken } from './interfaces/auth.access-token.interface';
import { IAuthLogin } from './interfaces/auth.login.interface';
import { IAuthRefreshToken } from './interfaces/auth.refresh-token.interface';
import { IAuthRegister } from './interfaces/auth.register.interface';
import { IAuthResponse } from './interfaces/auth.response.interface';

@Injectable()
export class AuthService {
  static readonly LOGGER_KEY = 'auth-service-logger';

  constructor(
    @Inject(AuthService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly authConfig: AuthConfig,
    private readonly authManagedCustomProviderEmailPasswordService: AuthManagedCustomProviderEmailPasswordService,
    private readonly userIdentityProviderService: UserIdentityProviderService,
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async encryptPassword(password: string): Promise<string> {
    const encryptedPassword = await this.authManagedCustomProviderEmailPasswordService.encryptPassword(password);
    return encryptedPassword;
  }

  async verifyToken(accessToken: string): Promise<IAuthAccessToken> {
    const payload =
      this.authManagedCustomProviderEmailPasswordService.verifyAccessToken<IAuthManagedCustomProviderAccessTokenPayload>(
        accessToken,
      );

    return AuthHelper.fromIAuthManagedCustomProviderAccessTokenPayload(payload);
  }

  async login(data: IAuthLogin): Promise<IAuthResponse> {
    const { email } = data;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      this.logger.warn(`Login failed because could not find user by email ${email}.`);
      throw new BadRequestException(`Invalid credentials`, 'AUTH_LOGIN_INVALID_CREDENTIALS');
    }
    if (!user.password) {
      this.logger.warn(`Login failed because user by email ${email} does not have password.`);
      throw new BadRequestException('Invalid credentials', 'AUTH_LOGIN_INVALID_CREDENTIALS');
    }

    const passwordValid = await this.authManagedCustomProviderEmailPasswordService.encryptComparePassword(
      data.password,
      user.password,
    );

    if (!passwordValid) {
      this.logger.warn(`Login failed because user by email ${email} provided wrong password.`);
      throw new BadRequestException('Invalid credentials', 'AUTH_LOGIN_INVALID_CREDENTIALS');
    }

    const userIdentityProvider = await this.userIdentityProviderService.find({
      sub: user.id,
      source: undefined,
      integration: undefined,
    });
    if (!userIdentityProvider) {
      this.logger.warn(`Login failed because user with email ${email} does not have linked identity provider.`);
      throw new BadRequestException('Invalid credentials', 'AUTH_LOGIN_INVALID_CREDENTIALS');
    }

    const jti = makeUUID();
    const authResponse = await this.createAuthSession(user.id, userIdentityProvider.id, jti);

    return authResponse;
  }

  async register(data: IAuthRegister): Promise<IAuthResponse> {
    const { email, password } = data;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      this.logger.error(`User with email ${email} already exists.`);
      throw new ForbiddenException(`Email already taken.`, 'AUTH_REGISTER_EMAIL_TAKEN');
    }

    try {
      const encryptedPassword = await this.authManagedCustomProviderEmailPasswordService.encryptPassword(password);
      const newUser = await this.userService.create({ email, password: encryptedPassword });

      const newUserIdentityProvider = await this.userIdentityProviderService.create({
        userId: newUser.id,
        sub: newUser.id,
        emailVerified: false,
        source: undefined,
        integration: undefined,
      });

      const jti = makeUUID();
      const result = await this.createAuthSession(newUser.id, newUserIdentityProvider.id, jti);
      return result;
    } catch (error) {
      this.logger.error(`Error occurred registering a user: `, error);
      throw new InternalServerErrorException(`Error occurred registering user.`, 'AUTH_REGISTER_ERROR_OCCURRED');
    }
  }

  async refreshToken(data: IAuthRefreshToken): Promise<IAuthResponse> {
    const { accessToken, refreshToken } = data;

    let refreshTokenPayload: IAuthManagedCustomProviderRefreshTokenPayload;
    try {
      refreshTokenPayload = await this.authManagedCustomProviderEmailPasswordService.verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token.', 'AUTH_REFRESH_TOKEN_INVALID_TOKEN');
    }

    const { sub: userId, jtiSource } = refreshTokenPayload;

    let accessTokenPayload: IAuthManagedCustomProviderAccessTokenPayload;
    try {
      accessTokenPayload = await this.authManagedCustomProviderEmailPasswordService.decodeAccessToken(accessToken);
    } catch (err) {
      throw new InternalServerErrorException('Faulty token.', 'AUTH_REFRESH_TOKEN_FAULTY_TOKEN');
    }

    const { jti } = accessTokenPayload;

    if (jtiSource !== jti) {
      throw new UnauthorizedException('Invalid user session to refresh.', 'AUTH_REFRESH_TOKEN_INVALID_SESSION');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      this.logger.error(`Refreshing access token for user ${userId} that does not exist.`);
      throw new InternalServerErrorException('Faulty token.', 'AUTH_REFRESH_TOKEN_FAULTY_TOKEN');
    }

    const userSession = await this.userSessionService.findForUserByJti(userId, jti);
    if (!userSession) {
      this.logger.error(`Could not find user session in database for user ${userId}, jti ${jti}.`);
      throw new BadRequestException(`Cannot refresh requested session.`, 'AUTH_REFRESH_TOKEN_CANNOT_REFRESH');
    }

    const newJti = makeUUID();
    const result = await this.updateAuthSession(userSession.id, user.id, newJti);

    return result;
  }

  async createAuthSession(userId: string, userIdentityProviderId: string, jti: string): Promise<IAuthResponse> {
    const { accessTokenExpiration, refreshTokenExpiration } = this.authConfig;

    const response = this.authManagedCustomProviderEmailPasswordService.generateTokens({ sub: userId, jti });

    const now = DateTime.now();
    const accessTokenExpire = now.plus({ seconds: accessTokenExpiration }).toJSDate();
    const refreshTokenExpire = now.plus({ seconds: refreshTokenExpiration }).toJSDate();

    const userSession = await this.userSessionService.create({
      userId,
      userIdentityProviderId,
      jti,
      expireAt: accessTokenExpire,
    });

    await this.refreshTokenService.create({
      userSessionId: userSession.id,
      userId,
      token: response.refreshToken,
      expireAt: refreshTokenExpire,
    });

    return response;
  }

  async updateAuthSession(sessionId: string, userId: string, jti: string): Promise<IAuthResponse> {
    const { accessTokenExpiration, refreshTokenExpiration } = this.authConfig;

    const response = this.authManagedCustomProviderEmailPasswordService.generateTokens({ sub: userId, jti });

    const now = DateTime.now();
    const accessTokenExpire = now.plus({ seconds: accessTokenExpiration }).toJSDate();
    const refreshTokenExpire = now.plus({ seconds: refreshTokenExpiration }).toJSDate();

    await this.userSessionService.updateById(sessionId, {
      expireAt: accessTokenExpire,
      jti,
    });
    await this.refreshTokenService.updateByUserSessionId(sessionId, {
      token: response.refreshToken,
      expireAt: refreshTokenExpire,
    });

    return response;
  }
}
