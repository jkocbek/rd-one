export interface OpenidClientAwsCognitoUserInfo {
  sub: string;
  identities: string;
  email_verified: string;
  email: string;
  username: string;
  'custom:invitation_token': string; // DEV: This is custom property you need to implement on AWS Cognito
}
