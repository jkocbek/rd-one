import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { UserIdentityProviderService } from '~modules/user-identity-provider/user-identity-provider.service';

import { VerifiedRequest } from '../requests/verified.request';

@Injectable()
export class VerificationMiddleware implements NestMiddleware {
  constructor(private readonly userIdentityProviderService: UserIdentityProviderService) {}

  async use(request: VerifiedRequest, _res: Response, next: NextFunction): Promise<void> {
    const authenticatedUser = request.authenticatedUser;
    if (authenticatedUser) {
      if (!authenticatedUser.tokenPayload.sub) {
        throw new UnauthorizedException('Unauthorized');
      }

      const userIdentity = await this.userIdentityProviderService.findById(authenticatedUser.userIdentityProviderId);
      if (!userIdentity) {
        return next();
      }

      const { user } = userIdentity;

      request.verifiedUser = {
        id: user.id,
        email: user.email,
        roles: user.roles,
        emailVerified: userIdentity.emailVerified,
      };
    }

    return next();
  }
}
