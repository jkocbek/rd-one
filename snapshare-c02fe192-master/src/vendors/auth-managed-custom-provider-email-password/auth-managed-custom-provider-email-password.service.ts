import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { AuthManagedCustomProviderService } from '~vendors/auth-managed-custom-provider/auth-managed-custom-provider.service';
import { IAuthManagedCustomProviderAccessTokenPayload } from '~vendors/auth-managed-custom-provider/interfaces/auth-managed-custom-provider.access-token.payload.interface';
import { IAuthManagedCustomProviderRefreshTokenPayload } from '~vendors/auth-managed-custom-provider/interfaces/auth-managed-custom-provider.refresh-token.payload.interface';
import { IAuthManagedCustomProviderResponse } from '~vendors/auth-managed-custom-provider/interfaces/auth-managed-custom-provider.response.interface';

import { AuthManagedCustomProviderEmailPasswordConfig } from './auth-managed-custom-provider-email-password.config';

@Injectable()
export class AuthManagedCustomProviderEmailPasswordService extends AuthManagedCustomProviderService {
  static readonly LOGGER_KEY = 'auth-managed-custom-provider-email-password-service-logger';

  constructor(
    private readonly authManagedCustomProviderEmailPasswordConfig: AuthManagedCustomProviderEmailPasswordConfig,
  ) {
    super();
  }

  verifyAccessToken<Type>(accessToken: string): Type {
    const { accessTokenSecret } = this.authManagedCustomProviderEmailPasswordConfig;

    const result = jwt.verify(accessToken, accessTokenSecret) as Type;

    return result;
  }

  decodeAccessToken<Type>(token: string): Type {
    const result = jwt.decode(token) as Type;

    return result;
  }

  verifyRefreshToken<Type>(token: string): Type {
    const { refreshTokenSecret } = this.authManagedCustomProviderEmailPasswordConfig;
    const result = jwt.verify(token, refreshTokenSecret) as Type;

    return result;
  }

  async encryptPassword(password: string): Promise<string> {
    const { saltRounds } = this.authManagedCustomProviderEmailPasswordConfig;
    const salt = await bcryptjs.genSalt(saltRounds);
    const encrypted = await bcryptjs.hash(password, salt);

    return encrypted;
  }

  async encryptComparePassword(password: string, encrypted: string): Promise<boolean> {
    const result = bcryptjs.compare(password, encrypted);

    return result;
  }

  generateTokens(payload: IAuthManagedCustomProviderAccessTokenPayload): IAuthManagedCustomProviderResponse {
    const accessToken = this.signAccessToken(payload);

    const refreshTokenPayload: IAuthManagedCustomProviderRefreshTokenPayload = {
      sub: payload.sub,
      jtiSource: payload.jti,
    };
    const refreshToken = this.signRefreshToken(refreshTokenPayload);

    return { accessToken, refreshToken };
  }

  private signAccessToken(payload: IAuthManagedCustomProviderAccessTokenPayload): string {
    const { accessTokenSecret, accessTokenExpiration } = this.authManagedCustomProviderEmailPasswordConfig;
    const result = jwt.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenExpiration,
    });

    return result;
  }

  private signRefreshToken(payload: IAuthManagedCustomProviderRefreshTokenPayload): string {
    const { refreshTokenSecret, refreshTokenExpiration } = this.authManagedCustomProviderEmailPasswordConfig;
    const result = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: refreshTokenExpiration,
    });

    return result;
  }
}
