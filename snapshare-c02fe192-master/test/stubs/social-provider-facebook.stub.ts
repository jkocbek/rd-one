import { IAuthManagedSocialProviderPublicCredentials } from '~vendors/auth-managed-social-provider/interfaces/auth-managed-social-provider.base.public-credentials.interface';

export const socialProviderFacebookPublicCredentialsStub: Partial<IAuthManagedSocialProviderPublicCredentials> = {
  baseUrl: 'http://example.com',
  clientId: '0000000000',
  responseType: 'code',
  scopes: [],
};
