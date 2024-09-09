export interface IAuthManagedSocialProviderGoogleTokenInfo {
  aud: string;
  scopes: string[];
  expiryDate: Date;
  sub?: string;
  email?: string;
  emailVerified?: boolean;
  userId?: string;
  azp?: string;
  accessType?: 'offline' | 'online';
}
