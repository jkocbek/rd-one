export interface IRefreshToken {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
  expireAt: Date;
  userSessionId: string;
  userId: string;
}
