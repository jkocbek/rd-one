export interface IUserSession {
  id: string;
  jti: string;
  expireAt: Date;
  createdAt: Date;
  userId: string;
  userIdentityProviderId: string;
}
