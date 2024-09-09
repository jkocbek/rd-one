export interface OpenidClientAuth0UserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  invitation_token: string; // DEV: This is custom property you need to implement on Auth0
}
