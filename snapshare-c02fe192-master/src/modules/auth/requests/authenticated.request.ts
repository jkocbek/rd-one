import { Request } from 'express';

import { IAuthenticatedUser } from '../interfaces/authenticated-user.interface';

export interface AuthenticatedRequest extends Request {
  authenticatedUser?: IAuthenticatedUser;
}
