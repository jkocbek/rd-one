export interface IUserInvitation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
  expireAt: Date;
  userId: string;
}
