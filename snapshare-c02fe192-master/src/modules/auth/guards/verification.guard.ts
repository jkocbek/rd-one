import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AllowedUserRoles } from '../decorators/allowed-user-roles.decorator';
import { VerifiedRequest } from '../requests/verified.request';
import { AuthenticationGuard } from './authentication.guard';

@Injectable()
export class VerificationGuard extends AuthenticationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: VerifiedRequest = context.switchToHttp().getRequest();

    this.validateIsAuthenticated(request);

    if (!request.verifiedUser) {
      return false;
    }

    const { roles } = request.verifiedUser;

    const allowedRoles = this.reflector.get(AllowedUserRoles, context.getHandler());
    if (allowedRoles && allowedRoles.length > 0) {
      const atleastOneRoleAllowed = allowedRoles.some((allowedRole) => roles.find((role) => role === allowedRole));
      if (!atleastOneRoleAllowed) {
        return false;
      }
    }

    return true;
  }
}
