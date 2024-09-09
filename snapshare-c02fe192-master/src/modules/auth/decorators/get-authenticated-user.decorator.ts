import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IAuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { AuthenticatedRequest } from '../requests/authenticated.request';

export const GetAuthenticatedUser = createParamDecorator((data, ctx: ExecutionContext): IAuthenticatedUser => {
  const req = ctx.switchToHttp().getRequest() as AuthenticatedRequest;
  return req.authenticatedUser as IAuthenticatedUser;
});
