export interface IPasswordForgotCreate {
  code: string;
  expireAt: Date;
  userId: string;
}
