import { IVerifiedUser } from '../interfaces/verified-user.interface';
import { AuthenticatedRequest } from './authenticated.request';

export interface VerifiedRequest extends AuthenticatedRequest {
  verifiedUser?: IVerifiedUser;
}
