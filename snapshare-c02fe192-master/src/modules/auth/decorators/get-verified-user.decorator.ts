import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IVerifiedUser } from '../interfaces/verified-user.interface';
import { VerifiedRequest } from '../requests/verified.request';

export const GetVerifiedUser = createParamDecorator((data, ctx: ExecutionContext): IVerifiedUser => {
  const req = ctx.switchToHttp().getRequest() as VerifiedRequest;
  return req.verifiedUser as IVerifiedUser;
});
