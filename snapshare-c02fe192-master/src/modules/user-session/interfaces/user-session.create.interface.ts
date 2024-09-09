export interface IUserSessionCreate {
  jti: string;
  expireAt: Date;
  userId: string;
  userIdentityProviderId: string;
}
