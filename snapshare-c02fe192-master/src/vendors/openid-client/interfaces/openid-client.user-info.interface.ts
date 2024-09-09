export interface OpenidClientUserinfo {
  sub: string;
  email?: string;
  emailVerified?: boolean;
  username?: string;
  invitationToken?: string;
}
