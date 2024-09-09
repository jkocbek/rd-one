export interface IRefreshTokenCreate {
  token: string;
  expireAt: Date;
  userSessionId: string;
  userId: string;
}
