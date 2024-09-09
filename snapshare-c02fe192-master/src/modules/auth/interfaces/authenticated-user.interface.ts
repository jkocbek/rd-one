import { IAuthAccessToken } from './auth.access-token.interface';

export interface IAuthenticatedUser {
  accessToken: string;
  tokenPayload: IAuthAccessToken;
  userId: string;
  userIdentityProviderId: string;
  userSessionId: string;
}
