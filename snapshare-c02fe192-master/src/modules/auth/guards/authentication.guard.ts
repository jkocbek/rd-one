import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticatedRequest } from '../requests/authenticated.request';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    this.validateIsAuthenticated(request);

    return true;
  }

  protected validateIsAuthenticated(request: AuthenticatedRequest): void {
    const isAuthenticated = request.authenticatedUser?.accessToken && request.authenticatedUser?.tokenPayload;
    if (!isAuthenticated) {
      throw new UnauthorizedException();
    }
  }
}
