import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { DateTime } from 'luxon';

import { UnauthorizedException } from '~common/exceptions';

import { UserSessionService } from '~modules/user-session/user-session.service';

import { AuthService } from '../auth.service';
import { IAuthAccessToken } from '../interfaces/auth.access-token.interface';
import { AuthenticatedRequest } from '../requests/authenticated.request';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  static readonly LOGGER_KEY = 'authentication-middleware-logger';

  constructor(
    @Inject(AuthenticationMiddleware.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly authService: AuthService,
    private readonly userSessionService: UserSessionService,
  ) {}

  async use(request: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> {
    const header = request.header('Authorization');

    if (!header) {
      return next();
    }

    const headerParts = header.split(' ');
    if (headerParts.length !== 2 || headerParts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Unauthorized', 'AUTH_UNAUTHORIZED');
    }

    const accessToken = headerParts[1];

    let payload: IAuthAccessToken;
    try {
      payload = await this.authService.verifyToken(accessToken);
    } catch (err) {
      this.logger.error('Error occurred verifying access token. Err: ', err);
      throw new UnauthorizedException('Unauthorized', 'AUTH_UNAUTHORIZED');
    }

    const { sub: userId, jti } = payload;

    const userSession = await this.userSessionService.findForUserByJti(userId, jti);
    if (!userSession) {
      throw new UnauthorizedException('Invalid user session.', 'AUTH_UNAUTHORIZED');
    }

    const now = DateTime.now().toJSDate();
    const timeDiff = now.getTime() - userSession.expireAt.getTime();
    const isSessionExpired = timeDiff > 0;
    if (isSessionExpired) {
      throw new UnauthorizedException('User session expired.', 'AUTH_UNAUTHORIZED');
    }

    request.authenticatedUser = {
      accessToken,
      tokenPayload: payload,
      userId,
      userIdentityProviderId: userSession.userIdentityProviderId,
      userSessionId: userSession.id,
    };

    return next();
  }
}
